import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { Search, TrendingUp, AlertCircle, MousePointer, Clock, ArrowLeft } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export default function Analytics() {
  const { getCartCount } = useCart();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [topSearches, setTopSearches] = useState([]);
  const [zeroResults, setZeroResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const [statsRes, topRes, zeroRes] = await Promise.all([
        fetch(`${API_BASE}/analytics/stats?days=7`),
        fetch(`${API_BASE}/analytics/top-searches?days=7&limit=10`),
        fetch(`${API_BASE}/analytics/zero-results?days=7&limit=10`)
      ]);

      if (statsRes.ok) setStats(await statsRes.json());
      if (topRes.ok) setTopSearches(await topRes.json());
      if (zeroRes.ok) setZeroResults(await zeroRes.json());
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    navigate(`/products?search=${encodeURIComponent(query)}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header onSearch={handleSearch} cartCount={getCartCount()} />
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header onSearch={handleSearch} cartCount={getCartCount()} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Search Analytics</h1>
            <p className="text-muted-foreground">Last 7 days performance</p>
          </div>
          <Button variant="outline" onClick={() => navigate('/admin')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Admin
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Search className="h-4 w-4" />
                Total Searches
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats?.total_searches || 0}</div>
              <p className="text-xs text-muted-foreground">{stats?.unique_queries || 0} unique queries</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                Zero Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-destructive">{stats?.zero_result_searches || 0}</div>
              <p className="text-xs text-muted-foreground">{stats?.zero_result_rate || 0}% of searches</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <MousePointer className="h-4 w-4" />
                Click-Through Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{stats?.click_through_rate || 0}%</div>
              <p className="text-xs text-muted-foreground">{stats?.total_clicks || 0} total clicks</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Period
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats?.period_days || 7}</div>
              <p className="text-xs text-muted-foreground">days of data</p>
            </CardContent>
          </Card>
        </div>

        {/* Top Searches & Zero Results */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Top Searches
              </CardTitle>
              <CardDescription>Most popular search queries</CardDescription>
            </CardHeader>
            <CardContent>
              {topSearches.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No search data yet</p>
              ) : (
                <div className="space-y-3">
                  {topSearches.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50">
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-bold text-muted-foreground w-6">{index + 1}</span>
                        <span className="font-medium">{item.query}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold">{item.count}</span>
                        <span className="text-sm text-muted-foreground ml-2">({item.avg_results} avg results)</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-destructive" />
                Zero Result Queries
              </CardTitle>
              <CardDescription>Searches that found nothing (inventory gaps)</CardDescription>
            </CardHeader>
            <CardContent>
              {zeroResults.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No zero-result queries! 🎉</p>
              ) : (
                <div className="space-y-3">
                  {zeroResults.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 border-l-2 border-destructive">
                      <span className="font-medium">{item.query}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-destructive">{item.count}x</span>
                        <Button size="sm" variant="outline" onClick={() => navigate(`/admin?add=${item.query}`)}>
                          Add Product
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
