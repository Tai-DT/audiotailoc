// Export utilities for reports and data using professional libraries
import { toast } from 'sonner'
import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

export interface ExportOptions {
  filename: string
  format: 'pdf' | 'excel' | 'csv'
  data: Record<string, unknown>[]
  columns?: { key: string; header: string; width?: number }[]
  title?: string
  subtitle?: string
}

/**
 * Export data to CSV format
 */
export function exportToCSV(options: ExportOptions): void {
  try {
    const { filename, data, columns } = options

    if (!data || data.length === 0) {
      toast.error('Không có dữ liệu để xuất')
      return
    }

    // Get column headers and keys
    const headers = columns ? columns.map(c => c.header) : Object.keys(data[0])
    const keys = columns ? columns.map(c => c.key) : Object.keys(data[0])

    // Create CSV content
    const csvContent = [
      headers.join(','),
      ...data.map((row: Record<string, unknown>) =>
        keys.map(key => {
          const value = row[key]
          // Escape quotes and wrap in quotes if contains comma
          if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`
          }
          return value ?? ''
        }).join(',')
      )
    ].join('\n')

    // Add BOM for Excel UTF-8 support
    const BOM = '\uFEFF'
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' })
    downloadFile(blob, `${filename}.csv`)
    toast.success('Xuất CSV thành công')
  } catch (error) {
    console.error('CSV export error:', error)
    toast.error('Lỗi khi xuất CSV')
  }
}

/**
 * Export data to Excel format using XLSX library
 */
export function exportToExcel(options: ExportOptions): void {
  try {
    const { filename, data, columns, title, subtitle } = options

    if (!data || data.length === 0) {
      toast.error('Không có dữ liệu để xuất')
      return
    }

    // Create workbook
    const wb = XLSX.utils.book_new()

    // Prepare data with headers
    const headers = columns ? columns.map(c => c.header) : Object.keys(data[0])
    const keys = columns ? columns.map(c => c.key) : Object.keys(data[0])

    // Map data to use custom headers
    const exportData = data.map((row: Record<string, unknown>) => {
      const newRow: Record<string, unknown> = {}
      keys.forEach((key, index) => {
        newRow[headers[index]] = row[key]
      })
      return newRow
    })

    // Convert to worksheet
    const ws = XLSX.utils.json_to_sheet(exportData)

    // Add title rows if provided
    if (title) {
      XLSX.utils.sheet_add_aoa(ws, [[title]], { origin: 'A1' })
      if (subtitle) {
        XLSX.utils.sheet_add_aoa(ws, [[subtitle]], { origin: 'A2' })
      }
      XLSX.utils.sheet_add_aoa(ws, [[`Ngày tạo: ${new Date().toLocaleString('vi-VN')}`]], { origin: 'A3' })
      // Re-add data starting from row 5
      XLSX.utils.sheet_add_json(ws, exportData, { origin: 'A5', skipHeader: false })
    }

    // Set column widths
    if (columns) {
      ws['!cols'] = columns.map(col => ({ wch: col.width || 20 }))
    }

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Báo cáo')

    // Write file
    XLSX.writeFile(wb, `${filename}.xlsx`)
    toast.success('Xuất Excel thành công')
  } catch (error) {
    console.error('Excel export error:', error)
    toast.error('Lỗi khi xuất Excel')
  }
}

/**
 * Export data to PDF format using jsPDF
 */
export function exportToPDF(options: ExportOptions): void {
  try {
    const { filename, data, columns, title, subtitle } = options

    if (!data || data.length === 0) {
      toast.error('Không có dữ liệu để xuất')
      return
    }

    // Create PDF
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    })

    let yPosition = 20

    // Add title
    if (title) {
      doc.setFontSize(16)
      doc.setFont('helvetica', 'bold')
      doc.text(title, doc.internal.pageSize.getWidth() / 2, yPosition, { align: 'center' })
      yPosition += 10
    }

    // Add subtitle
    if (subtitle) {
      doc.setFontSize(12)
      doc.setFont('helvetica', 'normal')
      doc.text(subtitle, doc.internal.pageSize.getWidth() / 2, yPosition, { align: 'center' })
      yPosition += 8
    }

    // Add date
    doc.setFontSize(10)
    doc.text(`Ngày tạo: ${new Date().toLocaleString('vi-VN')}`, doc.internal.pageSize.getWidth() / 2, yPosition, { align: 'center' })
    yPosition += 10

    // Prepare table data
    const headers = columns ? columns.map(c => c.header) : Object.keys(data[0])
    const keys = columns ? columns.map(c => c.key) : Object.keys(data[0])

    const tableData = data.map((row: Record<string, unknown>) =>
      keys.map(key => {
        const value = row[key]
        if (value === null || value === undefined) return ''
        if (typeof value === 'number') return value.toLocaleString('vi-VN')
        if (value instanceof Date) return value.toLocaleDateString('vi-VN')
        return String(value)
      })
    )

    // Add table
    autoTable(doc, {
      head: [headers],
      body: tableData,
      startY: yPosition,
      theme: 'grid',
      styles: {
        fontSize: 9,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [74, 85, 104],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
      },
      alternateRowStyles: {
        fillColor: [247, 250, 252],
      },
      columnStyles: columns ? columns.reduce<Record<number, { cellWidth: number }>>((acc, col, index) => {
        if (col.width) {
          acc[index] = { cellWidth: col.width }
        }
        return acc
      }, {}) : {},
    })

    // Add page numbers
    const pageCount = (doc as unknown as { internal: { getNumberOfPages(): number } }).internal.getNumberOfPages()
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i)
      doc.setFontSize(8)
      doc.text(
        `Trang ${i} / ${pageCount}`,
        doc.internal.pageSize.getWidth() - 20,
        doc.internal.pageSize.getHeight() - 10,
        { align: 'right' }
      )
    }

    // Save PDF
    doc.save(`${filename}.pdf`)
    toast.success('Xuất PDF thành công')
  } catch (error) {
    console.error('PDF export error:', error)
    toast.error('Lỗi khi xuất PDF')
  }
}

/**
 * Download file helper
 */
function downloadFile(blob: Blob, filename: string): void {
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}

/**
 * Export reports to multiple formats
 */
export function exportReports(
  reports: Record<string, unknown>[],
  format: 'pdf' | 'excel' | 'csv' = 'pdf',
  columns?: { key: string; header: string; width?: number }[]
): void {
  if (!reports || reports.length === 0) {
    toast.error('Không có báo cáo để xuất')
    return
  }

  const defaultColumns = [
    { key: 'id', header: 'Mã', width: 15 },
    { key: 'name', header: 'Tên báo cáo', width: 30 },
    { key: 'type', header: 'Loại', width: 15 },
    { key: 'format', header: 'Định dạng', width: 10 },
    { key: 'period', header: 'Kỳ báo cáo', width: 15 },
    { key: 'createdAt', header: 'Ngày tạo', width: 20 }
  ]

  const filename = `bao-cao-${new Date().toISOString().split('T')[0]}`

  const options: ExportOptions = {
    filename,
    format,
    data: reports,
    columns: columns || defaultColumns,
    title: 'Danh sách Báo cáo',
    subtitle: `Tổng số: ${reports.length} báo cáo`
  }

  switch (format) {
    case 'csv':
      exportToCSV(options)
      break
    case 'excel':
      exportToExcel(options)
      break
    case 'pdf':
      exportToPDF(options)
      break
    default:
      toast.error('Định dạng không hỗ trợ')
  }
}

/**
 * Export table data with custom options
 */
export function exportTableData(
  tableData: Record<string, unknown>[],
  tableName: string,
  format: 'pdf' | 'excel' | 'csv' = 'csv',
  columns?: { key: string; header: string; width?: number }[]
): void {
  if (!tableData || tableData.length === 0) {
    toast.error('Không có dữ liệu để xuất')
    return
  }

  const filename = `${tableName}-${new Date().toISOString().split('T')[0]}`
  const finalColumns = columns || Object.keys(tableData[0]).map(key => ({
    key,
    header: formatHeader(key),
    width: 20
  }))

  const options: ExportOptions = {
    filename,
    format,
    data: tableData,
    columns: finalColumns,
    title: tableName,
    subtitle: `Tổng số: ${tableData.length} bản ghi`
  }

  switch (format) {
    case 'csv':
      exportToCSV(options)
      break
    case 'excel':
      exportToExcel(options)
      break
    case 'pdf':
      exportToPDF(options)
      break
    default:
      toast.error('Định dạng không hỗ trợ')
  }
}

/**
 * Format header from field name
 */
function formatHeader(field: string): string {
  return field
    .replace(/([A-Z])/g, ' $1')
    .replace(/_/g, ' ')
    .trim()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}
