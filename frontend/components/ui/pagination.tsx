import * as React from "react"
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

interface PaginationProps extends React.ComponentProps<"nav"> {
 /** Total number of pages for screen readers */
 totalPages?: number;
}

const Pagination = ({ className, totalPages, ...props }: PaginationProps) => (
 <nav
 role="navigation"
 aria-label={totalPages ? `Phân trang, tổng cộng ${totalPages} trang` : "Phân trang"}
 className={cn("mx-auto flex w-full justify-center", className)}
 {...props}
 />
)
Pagination.displayName = "Pagination"

const PaginationContent = React.forwardRef<
 HTMLUListElement,
 React.ComponentProps<"ul">
>(({ className, ...props }, ref) => (
 <ul
 ref={ref}
 className={cn("flex flex-row items-center gap-1", className)}
 {...props}
 />
))
PaginationContent.displayName = "PaginationContent"

const PaginationItem = React.forwardRef<
 HTMLLIElement,
 React.ComponentProps<"li">
>(({ className, ...props }, ref) => (
 <li ref={ref} className={cn("", className)} {...props} />
))
PaginationItem.displayName = "PaginationItem"

type PaginationLinkProps = {
 isActive?: boolean
 disabled?: boolean
} & {
 size?: "default" | "sm" | "lg" | "icon" | null | undefined
} &
 React.ComponentProps<"a">

const PaginationLink = ({
 className,
 isActive,
 disabled,
 size = "icon",
 ...props
}: PaginationLinkProps) => (
 <a
 aria-current={isActive ? "page" : undefined}
 aria-disabled={disabled}
 tabIndex={disabled ? -1 : undefined}
 className={cn(
 buttonVariants({
 variant: isActive ? "outline" : "ghost",
 size,
 }),
 disabled && "pointer-events-none opacity-50",
 className
 )}
 {...props}
 />
)
PaginationLink.displayName = "PaginationLink"

interface PaginationPreviousProps extends React.ComponentProps<typeof PaginationLink> {
 /** Vietnamese label for the button */
 label?: string;
}

const PaginationPrevious = ({
 className,
 label = "Trước",
 disabled,
 ...props
}: PaginationPreviousProps) => (
 <PaginationLink
 aria-label="Đi đến trang trước"
 size="default"
 disabled={disabled}
 className={cn("gap-1 pl-2.5", className)}
 {...props}
 >
 <ChevronLeft className="h-4 w-4" aria-hidden="true" />
 <span>{label}</span>
 </PaginationLink>
)
PaginationPrevious.displayName = "PaginationPrevious"

interface PaginationNextProps extends React.ComponentProps<typeof PaginationLink> {
 /** Vietnamese label for the button */
 label?: string;
}

const PaginationNext = ({
 className,
 label = "Sau",
 disabled,
 ...props
}: PaginationNextProps) => (
 <PaginationLink
 aria-label="Đi đến trang sau"
 size="default"
 disabled={disabled}
 className={cn("gap-1 pr-2.5", className)}
 {...props}
 >
 <span>{label}</span>
 <ChevronRight className="h-4 w-4" aria-hidden="true" />
 </PaginationLink>
)
PaginationNext.displayName = "PaginationNext"

const PaginationEllipsis = ({
 className,
 ...props
}: React.ComponentProps<"span">) => (
 <span
 aria-hidden="true"
 className={cn("flex h-9 w-9 items-center justify-center", className)}
 {...props}
 >
 <MoreHorizontal className="h-4 w-4" />
 <span className="sr-only">Thêm trang</span>
 </span>
)
PaginationEllipsis.displayName = "PaginationEllipsis"

// ==================== ACCESSIBLE PAGINATION WRAPPER ====================
// A complete pagination component with accessibility built-in

interface AccessiblePaginationProps {
 currentPage: number;
 totalPages: number;
 onPageChange: (page: number) => void;
 className?: string;
 /** Show first/last page buttons */
 showEdges?: boolean;
 /** Maximum number of page links to show */
 siblingCount?: number;
}

export function AccessiblePagination({
 currentPage,
 totalPages,
 onPageChange,
 className,
 showEdges: _showEdges = false,
 siblingCount = 1,
}: AccessiblePaginationProps) {
 // Generate page numbers to display
 const generatePages = (): (number | 'ellipsis')[] => {
 const pages: (number | 'ellipsis')[] = [];
 // Always show first page
 pages.push(1);
 // Calculate range around current page
 const leftSibling = Math.max(2, currentPage - siblingCount);
 const rightSibling = Math.min(totalPages - 1, currentPage + siblingCount);
 // Add left ellipsis
 if (leftSibling > 2) {
 pages.push('ellipsis');
 }
 // Add pages around current
 for (let i = leftSibling; i <= rightSibling; i++) {
 if (i > 1 && i < totalPages) {
 pages.push(i);
 }
 }
 // Add right ellipsis
 if (rightSibling < totalPages - 1) {
 pages.push('ellipsis');
 }
 // Always show last page if more than 1 page
 if (totalPages > 1) {
 pages.push(totalPages);
 }
 return pages;
 };

 if (totalPages <= 1) return null;

 const pages = generatePages();

 return (
 <Pagination totalPages={totalPages} className={className}>
 <PaginationContent>
 {/* Previous button */}
 <PaginationItem>
 <PaginationPrevious
 onClick={(e) => {
 e.preventDefault();
 if (currentPage > 1) onPageChange(currentPage - 1);
 }}
 disabled={currentPage <= 1}
 href="#"
 />
 </PaginationItem>

 {/* Page numbers */}
 {pages.map((page, index) => (
 <PaginationItem key={`${page}-${index}`}>
 {page === 'ellipsis' ? (
 <PaginationEllipsis />
 ) : (
 <PaginationLink
 href="#"
 onClick={(e) => {
 e.preventDefault();
 onPageChange(page);
 }}
 isActive={page === currentPage}
 aria-label={`Đi đến trang ${page}`}
 >
 {page}
 </PaginationLink>
 )}
 </PaginationItem>
 ))}

 {/* Next button */}
 <PaginationItem>
 <PaginationNext
 onClick={(e) => {
 e.preventDefault();
 if (currentPage < totalPages) onPageChange(currentPage + 1);
 }}
 disabled={currentPage >= totalPages}
 href="#"
 />
 </PaginationItem>
 </PaginationContent>
 {/* Screen reader status */}
 <div className="sr-only" aria-live="polite" aria-atomic="true">
 Đang ở trang {currentPage} trong tổng số {totalPages} trang
 </div>
 </Pagination>
 );
}

export {
 Pagination,
 PaginationContent,
 PaginationEllipsis,
 PaginationItem,
 PaginationLink,
 PaginationNext,
 PaginationPrevious,
}