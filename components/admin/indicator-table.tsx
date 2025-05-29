"use client"

import { useState } from "react"
import Link from "next/link"
import type { Indicator } from "@/lib/types"
import { deleteIndicator } from "@/lib/indicators"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/components/ui/use-toast"

interface IndicatorTableProps {
  indicators: Indicator[]
}

export default function IndicatorTable({ indicators: initialIndicators }: IndicatorTableProps) {
  const [indicators, setIndicators] = useState(initialIndicators)
  const { toast } = useToast()

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this indicator? This action cannot be undone.")) {
      try {
        await deleteIndicator(id)
        setIndicators(indicators.filter((indicator) => indicator.id !== id))
        toast({
          title: "Indicator deleted",
          description: "The indicator has been successfully deleted.",
        })
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to delete the indicator. Please try again.",
        })
      }
    }
  }

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800"
      case "draft":
        return "bg-amber-100 text-amber-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getComplexityBadgeClass = (complexity: string) => {
    switch (complexity) {
      case "beginner":
        return "bg-green-100 text-green-800"
      case "intermediate":
        return "bg-amber-100 text-amber-800"
      case "advanced":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 text-left">
          <tr>
            <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Indicator</th>
            <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Categories</th>
            <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Complexity</th>
            <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {indicators.map((indicator) => (
            <tr key={indicator.id} className="hover:bg-gray-50">
              <td className="px-6 py-4">
                <div className="max-w-md">
                  <div className="font-medium text-gray-900 hover:text-blue-600 cursor-pointer">{indicator.name}</div>
                  <div className="text-sm text-gray-500 line-clamp-2">{indicator.description}</div>
                </div>
              </td>
              <td className="px-6 py-4">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(indicator.status)}`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5"></span>
                  {indicator.status.charAt(0).toUpperCase() + indicator.status.slice(1)}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="flex flex-wrap gap-1">
                  {indicator.categories.slice(0, 2).map((category, index) => (
                    <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                      {category}
                    </span>
                  ))}
                  {indicator.categories.length > 2 && (
                    <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                      +{indicator.categories.length - 2}
                    </span>
                  )}
                </div>
              </td>
              <td className="px-6 py-4">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getComplexityBadgeClass(indicator.complexity)}`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5"></span>
                  {indicator.complexity.charAt(0).toUpperCase() + indicator.complexity.slice(1)}
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">
                <div>{new Date(indicator.createdAt).toLocaleDateString()}</div>
                <div>
                  {new Date(indicator.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </div>
              </td>
              <td className="px-6 py-4 text-right text-sm font-medium">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="1" />
                        <circle cx="12" cy="5" r="1" />
                        <circle cx="12" cy="19" r="1" />
                      </svg>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/admin/indicators/${indicator.id}/edit`}>Edit</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/indicators/${indicator.slug}`} target="_blank">
                        View
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/admin/indicators/${indicator.id}/duplicate`}>Duplicate</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-red-600 focus:text-red-600"
                      onClick={() => handleDelete(indicator.id)}
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
