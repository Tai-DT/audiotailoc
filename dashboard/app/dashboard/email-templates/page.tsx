"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Mail,
  FileText,
  CheckCircle,
  Clock,
  RefreshCw,
  Eye,
  Code,
  LayoutTemplate
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { apiClient } from "@/lib/api-client"

interface EmailTemplate {
  id: string
  name: string
  type: string
  category: string
  subject: string
  lastModified: string
  isActive: boolean
}

interface TemplateDetail extends EmailTemplate {
  htmlContent: string
}

export default function EmailTemplatesPage() {
  const { toast } = useToast()
  const [templates, setTemplates] = useState<EmailTemplate[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isPreviewLoading, setIsPreviewLoading] = useState(false)
  const [viewMode, setViewMode] = useState<'preview' | 'code'>('preview')

  const fetchTemplates = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await apiClient.get<unknown>('/email/templates')
      if (response.success) {
        const data = response.data as unknown
        const list =
          Array.isArray(data) ? data :
          Array.isArray((data as any)?.templates) ? (data as any).templates :
          Array.isArray((data as any)?.items) ? (data as any).items :
          []

        setTemplates(list as EmailTemplate[])
        // Select first template by default - handled separately
        return list
      }
      return []
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách mẫu email",
        variant: "destructive",
      })
      return []
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  const handleSelectTemplate = useCallback(async (id: string) => {
    try {
      setIsPreviewLoading(true)
      const response = await apiClient.get<unknown>(`/email/templates/${id}`)
      if (response.success) {
        const raw = response.data as Record<string, unknown>
        if (raw && typeof raw === "object") {
          setSelectedTemplate({
            id: (raw.id as string) ?? id,
            name: (raw.name as string) ?? "Email Template",
            type: (raw.type as string) ?? "system",
            category: (raw.category as string) ?? "general",
            subject: (raw.subject as string) ?? "",
            lastModified: (raw.lastModified as string) ?? new Date().toISOString(),
            isActive: (raw.isActive as boolean) ?? true,
            htmlContent: (raw.htmlContent as string) ?? (raw.html as string) ?? "<p>(Không có nội dung)</p>",
          })
        }
      }
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể tải chi tiết mẫu email",
        variant: "destructive",
      })
    } finally {
      setIsPreviewLoading(false)
    }
  }, [toast])

  // Load templates on mount
  useEffect(() => {
    fetchTemplates().then((list) => {
      // Select first template by default after loading
      if (Array.isArray(list) && list.length > 0) {
        const firstId = (list[0] as EmailTemplate).id
        void handleSelectTemplate(firstId)
      }
    })
  }, [fetchTemplates, handleSelectTemplate])

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'orders': return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'invoices': return <FileText className="h-4 w-4 text-blue-500" />
      case 'onboarding': return <Mail className="h-4 w-4 text-yellow-500" />
      default: return <LayoutTemplate className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6 h-[calc(100vh-100px)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between flex-shrink-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mẫu Email</h1>
          <p className="text-muted-foreground">
            Quản lý và xem trước các mẫu email hệ thống
          </p>
        </div>
        <Button onClick={fetchTemplates} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Làm mới
        </Button>
      </div>

      <div className="grid grid-cols-12 gap-6 flex-1 min-h-0">
        {/* Templates List */}
        <div className="col-span-12 md:col-span-4 lg:col-span-3 flex flex-col min-h-0">
          <Card className="flex-1 flex flex-col min-h-0">
            <CardHeader className="pb-3 flex-shrink-0">
              <CardTitle className="text-lg">Danh sách mẫu</CardTitle>
              <CardDescription>
                Chọn mẫu để xem trước
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0 flex-1 min-h-0">
              <ScrollArea className="h-full">
                <div className="space-y-1 p-3">
                  {isLoading ? (
                    <div className="text-center py-4 text-muted-foreground">Đang tải...</div>
                  ) : (
                    templates.map((template) => (
                      <div
                        key={template.id}
                        onClick={() => handleSelectTemplate(template.id)}
                        className={`
                          flex items-start space-x-3 p-3 rounded-lg cursor-pointer transition-colors
                          ${selectedTemplate?.id === template.id 
                            ? "bg-secondary" 
                            : "hover:bg-secondary/50"}
                        `}
                      >
                        <div className="mt-1">
                          {getCategoryIcon(template.category)}
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium leading-none">
                              {template.name}
                            </p>
                          </div>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Badge variant="outline" className="text-[10px] mr-2 h-5">
                              {template.type}
                            </Badge>
                            {template.isActive && (
                              <span className="flex items-center text-green-600">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-600 mr-1"></span>
                                Active
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Preview Area */}
        <div className="col-span-12 md:col-span-8 lg:col-span-9 flex flex-col min-h-0">
          <Card className="flex-1 flex flex-col min-h-0 border-0 shadow-none md:border md:shadow-sm bg-transparent md:bg-card">
            {selectedTemplate ? (
              <>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b bg-card rounded-t-lg flex-shrink-0">
                  <div className="space-y-1">
                    <CardTitle>{selectedTemplate.name}</CardTitle>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <span className="font-medium mr-2">Tiêu đề:</span>
                      {selectedTemplate.subject}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as 'preview' | 'code')}>
                      <TabsList>
                        <TabsTrigger value="preview">
                          <Eye className="h-4 w-4 mr-2" />
                          Xem trước
                        </TabsTrigger>
                        <TabsTrigger value="code">
                          <Code className="h-4 w-4 mr-2" />
                          HTML
                        </TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>
                </CardHeader>
                <CardContent className="p-0 flex-1 min-h-0 bg-white relative">
                  {isPreviewLoading ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
                      <div className="flex flex-col items-center space-y-2">
                        <RefreshCw className="h-8 w-8 animate-spin text-primary" />
                        <span className="text-sm text-muted-foreground">Đang render mẫu...</span>
                      </div>
                    </div>
                  ) : (
                    <div className="h-full w-full overflow-hidden">
                      {viewMode === 'preview' ? (
                        <iframe
                          srcDoc={selectedTemplate.htmlContent}
                          className="w-full h-full border-0"
                          title="Email Preview"
                          sandbox="allow-same-origin"
                        />
                      ) : (
                        <ScrollArea className="h-full w-full bg-slate-950 text-slate-50 p-4 font-mono text-sm">
                          <pre>{selectedTemplate.htmlContent}</pre>
                        </ScrollArea>
                      )}
                    </div>
                  )}
                </CardContent>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <Mail className="h-12 w-12 mx-auto mb-4 opacity-20" />
                  <p>Chọn một mẫu email để xem chi tiết</p>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}