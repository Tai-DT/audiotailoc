import { Heart } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t bg-white py-6">
      <div className="container mx-auto px-6">
        <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">
              © 2024 AudioTailoc. Made with
            </span>
            <Heart className="h-4 w-4 text-red-500" />
            <span className="text-sm text-gray-600">in Vietnam</span>
          </div>
          
          <div className="flex items-center space-x-6">
            <a
              href="/privacy"
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="/terms"
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              Terms of Service
            </a>
            <a
              href="/support"
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              Support
            </a>
            <a
              href="/contact"
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              Contact
            </a>
          </div>
        </div>
        
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            Version 1.0.0 • Last updated: {new Date().toLocaleDateString('vi-VN')}
          </p>
        </div>
      </div>
    </footer>
  )
}
