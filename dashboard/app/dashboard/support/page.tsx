"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  MoreHorizontal,
  Search
} from "lucide-react"
import { toast } from "sonner"
import { apiClient } from "@/lib/api-client"

interface SupportTicket {
  id: string
  subject: string
  description: string
  email: string
  name: string
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED'
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  createdAt: string
  updatedAt: string
}

export default function SupportPage() {
  const [tickets, setTickets] = useState<SupportTicket[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [priorityFilter, setPriorityFilter] = useState<string>("all")
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null)
  const [showTicketDialog, setShowTicketDialog] = useState(false)

  const fetchTickets = useCallback(async () => {
    try {
      setLoading(true)
      const response = await apiClient.getTickets({
        status: statusFilter !== "all" ? statusFilter : undefined,
        priority: priorityFilter !== "all" ? priorityFilter : undefined,
      })
      const data = response.data as { items: SupportTicket[] } | SupportTicket[]
      if (data && 'items' in data && Array.isArray(data.items)) {
        setTickets(data.items)
      } else if (Array.isArray(data)) {
        setTickets(data)
      }
    } catch (error) {
      console.error("Failed to fetch tickets:", error)
      toast.error("Failed to load support tickets")
    } finally {
      setLoading(false)
    }
  }, [statusFilter, priorityFilter])

  useEffect(() => {
    fetchTickets()
  }, [fetchTickets])

  const handleStatusChange = async (ticketId: string, newStatus: string) => {
    try {
      await apiClient.updateTicketStatus(ticketId, newStatus)

      setTickets(prev => prev.map(ticket =>
        ticket.id === ticketId
          ? { ...ticket, status: newStatus as any }
          : ticket
      ))

      toast.success("Ticket status updated successfully")
    } catch (error) {
      console.error("Failed to update ticket status:", error)
      toast.error("Failed to update ticket status")
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      OPEN: { variant: "secondary" as const, icon: Clock, label: "Mở" },
      IN_PROGRESS: { variant: "default" as const, icon: RefreshCw, label: "Đang xử lý" },
      RESOLVED: { variant: "outline" as const, icon: CheckCircle, label: "Đã giải quyết" },
      CLOSED: { variant: "destructive" as const, icon: XCircle, label: "Đã đóng" }
    }
    const config = variants[status as keyof typeof variants] || variants.OPEN
    const Icon = config.icon

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    )
  }

  const getPriorityBadge = (priority: string) => {
    const variants = {
      LOW: { variant: "secondary" as const, label: "Thấp" },
      MEDIUM: { variant: "default" as const, label: "Trung bình" },
      HIGH: { variant: "destructive" as const, label: "Cao" },
      URGENT: { variant: "destructive" as const, label: "Khẩn cấp" }
    }
    const config = variants[priority as keyof typeof variants] || variants.MEDIUM

    return (
      <Badge variant={config.variant}>
        {config.label}
      </Badge>
    )
  }

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.name.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || ticket.status === statusFilter
    const matchesPriority = priorityFilter === "all" || ticket.priority === priorityFilter

    return matchesSearch && matchesStatus && matchesPriority
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "OPEN": return "bg-blue-100 text-blue-800"
      case "IN_PROGRESS": return "bg-yellow-100 text-yellow-800"
      case "RESOLVED": return "bg-green-100 text-green-800"
      case "CLOSED": return "bg-gray-100 text-gray-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "URGENT": return "text-red-600 font-bold"
      case "HIGH": return "text-orange-600 font-semibold"
      case "MEDIUM": return "text-blue-600"
      case "LOW": return "text-gray-600"
      default: return "text-gray-600"
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Support Tickets</h1>
          <p className="text-muted-foreground">Manage customer support requests and issues.</p>
        </div>
        <Button onClick={() => fetchTickets()}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tickets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="OPEN">Open</SelectItem>
            <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
            <SelectItem value="RESOLVED">Resolved</SelectItem>
            <SelectItem value="CLOSED">Closed</SelectItem>
          </SelectContent>
        </Select>
        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            <SelectItem value="URGENT">Urgent</SelectItem>
            <SelectItem value="HIGH">High</SelectItem>
            <SelectItem value="MEDIUM">Medium</SelectItem>
            <SelectItem value="LOW">Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ticket ID</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  Loading tickets...
                </TableCell>
              </TableRow>
            ) : filteredTickets.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  No tickets found
                </TableCell>
              </TableRow>
            ) : (
              filteredTickets.map((ticket) => (
                <TableRow key={ticket.id}>
                  <TableCell className="font-medium">{ticket.id.substring(0, 8)}...</TableCell>
                  <TableCell>
                    <div className="font-medium">{ticket.subject}</div>
                    <div className="text-sm text-muted-foreground truncate max-w-[300px]">
                      {ticket.description}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{ticket.name}</div>
                    <div className="text-sm text-muted-foreground">{ticket.email}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={getStatusColor(ticket.status)}>
                      {ticket.status.replace("_", " ")}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className={getPriorityColor(ticket.priority)}>
                      {ticket.priority}
                    </span>
                  </TableCell>
                  <TableCell>{new Date(ticket.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleStatusChange(ticket.id, "IN_PROGRESS")}>
                          Mark In Progress
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusChange(ticket.id, "RESOLVED")}>
                          Mark Resolved
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusChange(ticket.id, "CLOSED")}>
                          Close Ticket
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => {
                          setSelectedTicket(ticket)
                          setShowTicketDialog(true)
                        }}>View Details</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Ticket Detail Dialog */}
      <Dialog open={showTicketDialog} onOpenChange={setShowTicketDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Chi tiết ticket</DialogTitle>
            <DialogDescription>
              Thông tin chi tiết về yêu cầu hỗ trợ
            </DialogDescription>
          </DialogHeader>

          {selectedTicket && (
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label>Khách hàng</Label>
                  <div className="font-medium">{selectedTicket.name}</div>
                  <div className="text-sm text-muted-foreground">{selectedTicket.email}</div>
                </div>

                <div>
                  <Label>Trạng thái</Label>
                  <div className="mt-1">{getStatusBadge(selectedTicket.status)}</div>
                </div>

                <div>
                  <Label>Ưu tiên</Label>
                  <div className="mt-1">{getPriorityBadge(selectedTicket.priority)}</div>
                </div>

                <div>
                  <Label>Thời gian tạo</Label>
                  <div className="text-sm">
                    {new Date(selectedTicket.createdAt).toLocaleString('vi-VN')}
                  </div>
                </div>
              </div>

              <div>
                <Label>Tiêu đề</Label>
                <div className="font-medium mt-1">{selectedTicket.subject}</div>
              </div>

              <div>
                <Label>Nội dung</Label>
                <Textarea
                  value={selectedTicket.description}
                  readOnly
                  className="mt-1 min-h-32"
                />
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}