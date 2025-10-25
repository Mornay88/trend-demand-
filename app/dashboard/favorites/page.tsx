"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Star, Calendar, Eye, Trash2 } from "lucide-react"

// Mock favorites data
const mockFavorites = [
  {
    id: "search_1",
    keywords: ["wireless earbuds", "smart watch", "fitness tracker"],
    createdAt: "2025-01-15T10:30:00Z",
    topScore: 82,
  },
  {
    id: "search_3",
    keywords: ["phone case", "screen protector", "charging cable"],
    createdAt: "2025-01-13T09:20:00Z",
    topScore: 75,
  },
]

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState(mockFavorites)

  const handleRemoveFavorite = (id: string) => {
    // TODO: Implement remove favorite from database
    setFavorites(favorites.filter((f) => f.id !== id))
  }

  const getScoreColor = (score: number) => {
    if (score >= 75) return "text-green-400 bg-green-500/20 border-green-500/50"
    if (score >= 50) return "text-yellow-400 bg-yellow-500/20 border-yellow-500/50"
    return "text-red-400 bg-red-500/20 border-red-500/50"
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-950">
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-sm sticky top-0 z-50 bg-slate-950/50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-indigo-400" />
            <span className="text-xl font-bold text-white">Trend & Demand</span>
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" className="text-slate-300 hover:text-white">
                Dashboard
              </Button>
            </Link>
            <Link href="/dashboard/history">
              <Button variant="ghost" className="text-slate-300 hover:text-white">
                History
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3 flex items-center gap-3">
            <Star className="h-8 w-8 text-yellow-400 fill-yellow-400" />
            Favorites
          </h1>
          <p className="text-slate-400 text-lg">Your saved searches and top opportunities</p>
        </div>

        {favorites.length === 0 ? (
          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <CardContent className="py-12 text-center">
              <Star className="h-12 w-12 text-slate-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-300 mb-2">No favorites yet</h3>
              <p className="text-slate-400 mb-6">
                Save your best searches to quickly access them later. Click the star icon on any search to add it here.
              </p>
              <Link href="/dashboard/history">
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">View Search History</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {favorites.map((favorite) => (
              <Card
                key={favorite.id}
                className="bg-gradient-to-br from-yellow-600/10 to-orange-600/10 backdrop-blur-sm border-yellow-500/30 hover:border-yellow-500/50"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                        <CardTitle className="text-white text-lg">
                          {favorite.keywords.length} Keywords Analyzed
                        </CardTitle>
                        <Badge className={getScoreColor(favorite.topScore)}>Top Score: {favorite.topScore}</Badge>
                      </div>
                      <CardDescription className="text-slate-400 flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {new Date(favorite.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </CardDescription>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveFavorite(favorite.id)}
                      className="text-slate-400 hover:text-red-400"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {favorite.keywords.map((keyword, index) => (
                      <Badge key={index} variant="outline" className="border-yellow-500/50 text-yellow-300">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                  <Link href={`/dashboard/results/${favorite.id}`}>
                    <Button
                      variant="outline"
                      className="border-yellow-500/30 text-yellow-300 hover:bg-yellow-500/10 bg-transparent"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Results
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
