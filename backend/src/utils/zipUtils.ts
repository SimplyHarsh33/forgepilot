import zlib from 'zlib'
import fs from 'fs/promises'
import path from 'path'

// Helper to compute CRC32 checksum for raw buffers
function crc32(buf: Buffer): number {
  let crc = 0xffffffff
  for (let i = 0; i < buf.length; i++) {
    crc ^= buf[i]
    for (let j = 0; j < 8; j++) {
      crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0)
    }
  }
  return (crc ^ 0xffffffff) >>> 0
}

interface ZipEntry {
  filename: string
  uncompressedData: Buffer
  compressedData: Buffer
  crc: number
  offset: number
}

// Recursively collects relative file paths inside target directory
async function collectFiles(dirPath: string, baseDir: string = ''): Promise<{ relPath: string; fullPath: string }[]> {
  const entries = await fs.readdir(dirPath, { withFileTypes: true })
  let results: { relPath: string; fullPath: string }[] = []

  for (const entry of entries) {
    const relPath = baseDir ? `${baseDir}/${entry.name}` : entry.name
    const fullPath = path.join(dirPath, entry.name)

    // Skip hidden metadata files or git folders
    if (entry.name.startsWith('.') || entry.name === 'node_modules') continue

    if (entry.isDirectory()) {
      const subFiles = await collectFiles(fullPath, relPath)
      results = results.concat(subFiles)
    } else if (entry.isFile()) {
      results.push({ relPath, fullPath })
    }
  }

  return results
}

/**
 * Packs a directory into a standard .zip Buffer in-memory using Node.js zlib.
 */
export async function createZipArchive(projectDirPath: string): Promise<Buffer> {
  const files = await collectFiles(projectDirPath)
  const entries: ZipEntry[] = []
  const localHeaderBuffers: Buffer[] = []
  let currentOffset = 0

  for (const file of files) {
    const uncompressedData = await fs.readFile(file.fullPath)
    const compressedData = zlib.deflateRawSync(uncompressedData)
    const crc = crc32(uncompressedData)
    const filenameBuf = Buffer.from(file.relPath, 'utf-8')

    // Local file header structure (30 bytes + filename)
    const localHeader = Buffer.alloc(30 + filenameBuf.length)
    localHeader.writeUInt32LE(0x04034b50, 0) // Local header signature
    localHeader.writeUInt16LE(20, 4)         // Version needed to extract (2.0)
    localHeader.writeUInt16LE(0, 6)          // General purpose bit flag
    localHeader.writeUInt16LE(8, 8)          // Compression method (8 = Deflate)
    localHeader.writeUInt16LE(0, 10)         // Last mod file time
    localHeader.writeUInt16LE(0, 12)         // Last mod file date
    localHeader.writeUInt32LE(crc, 14)       // CRC-32
    localHeader.writeUInt32LE(compressedData.length, 18)   // Compressed size
    localHeader.writeUInt32LE(uncompressedData.length, 22) // Uncompressed size
    localHeader.writeUInt16LE(filenameBuf.length, 26)      // Filename length
    localHeader.writeUInt16LE(0, 28)                       // Extra field length
    filenameBuf.copy(localHeader, 30)

    entries.push({
      filename: file.relPath,
      uncompressedData,
      compressedData,
      crc,
      offset: currentOffset,
    })

    localHeaderBuffers.push(localHeader, compressedData)
    currentOffset += localHeader.length + compressedData.length
  }

  // Build Central Directory Headers
  const centralDirBuffers: Buffer[] = []
  let centralDirSize = 0

  for (const entry of entries) {
    const filenameBuf = Buffer.from(entry.filename, 'utf-8')
    const cdHeader = Buffer.alloc(46 + filenameBuf.length)
    cdHeader.writeUInt32LE(0x02014b50, 0) // Central directory header signature
    cdHeader.writeUInt16LE(20, 4)         // Version made by
    cdHeader.writeUInt16LE(20, 6)         // Version needed to extract
    cdHeader.writeUInt16LE(0, 8)          // General purpose bit flag
    cdHeader.writeUInt16LE(8, 10)         // Compression method (Deflate)
    cdHeader.writeUInt16LE(0, 12)         // Last mod time
    cdHeader.writeUInt16LE(0, 14)         // Last mod date
    cdHeader.writeUInt32LE(entry.crc, 16)
    cdHeader.writeUInt32LE(entry.compressedData.length, 20)
    cdHeader.writeUInt32LE(entry.uncompressedData.length, 24)
    cdHeader.writeUInt16LE(filenameBuf.length, 28)
    cdHeader.writeUInt16LE(0, 30)         // Extra field length
    cdHeader.writeUInt16LE(0, 32)         // File comment length
    cdHeader.writeUInt16LE(0, 34)         // Disk number start
    cdHeader.writeUInt16LE(0, 36)         // Internal file attributes
    cdHeader.writeUInt32LE(0, 38)         // External file attributes
    cdHeader.writeUInt32LE(entry.offset, 42) // Relative offset of local header
    filenameBuf.copy(cdHeader, 46)

    centralDirBuffers.push(cdHeader)
    centralDirSize += cdHeader.length
  }

  const centralDirStartOffset = currentOffset

  // End of Central Directory Record (22 bytes)
  const eocd = Buffer.alloc(22)
  eocd.writeUInt32LE(0x06054b50, 0)                // EOCD signature
  eocd.writeUInt16LE(0, 4)                         // Number of this disk
  eocd.writeUInt16LE(0, 6)                         // Disk where central directory starts
  eocd.writeUInt16LE(entries.length, 8)            // Number of central directory records on this disk
  eocd.writeUInt16LE(entries.length, 10)           // Total number of central directory records
  eocd.writeUInt32LE(centralDirSize, 12)           // Size of central directory
  eocd.writeUInt32LE(centralDirStartOffset, 16)    // Offset of start of central directory
  eocd.writeUInt16LE(0, 20)                        // ZIP comment length

  return Buffer.concat([...localHeaderBuffers, ...centralDirBuffers, eocd])
}
