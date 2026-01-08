import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Truck, Heart, Award } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const About = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSearch = (query) => {
    navigate(`/products?search=${encodeURIComponent(query)}`);
  };

  const features = [
    {
      icon: Shield,
      title: "Secure Shopping",
      description: "Your data and payments are protected with industry-leading security measures."
    },
    {
      icon: Truck,
      title: "Fast Delivery",
      description: "Free shipping on orders over $50 with express delivery options available."
    },
    {
      icon: Heart,
      title: "Customer Care",
      description: "24/7 customer support to help you with any questions or concerns."
    },
    {
      icon: Award,
      title: "Quality Guarantee",
      description: "100% satisfaction guarantee with easy returns and exchanges."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header onSearch={handleSearch} cartCount={0} />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="text-center py-16 mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
            About Cartella
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8 animate-fade-in">
          A system that uses NLP and relevance scoring to return the most appropriate products, even if the user's query is vague, misspelled, or natural language-based.
          </p>
          <Button size="lg" className="animate-slide-up" onClick={() => navigate('/products')}>
            Start Shopping
          </Button>
        </section>

        {/* Mission Section */}
        <section className="mb-16">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
              <p className="text-muted-foreground mb-4">
                At Cartella, we believe shopping should be enjoyable, convenient, and accessible to everyone. 
                A system that uses NLP and relevance scoring to return the most appropriate products, even if the user's query is vague, misspelled, or natural language-based.
              </p>
              <p className="text-muted-foreground">
              A system that uses NLP and relevance scoring to return the most appropriate products, even if the user's query is vague, misspelled, or natural language-based.
              </p>
            </div>
            <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg p-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">10K+</div>
                <div className="text-muted-foreground mb-4">Happy Customers</div>
                <div className="text-4xl font-bold text-primary mb-2">50K+</div>
                <div className="text-muted-foreground mb-4">Products Sold</div>
                <div className="text-4xl font-bold text-primary mb-2">99%</div>
                <div className="text-muted-foreground">Satisfaction Rate</div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Cartella?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Developer Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Meet The Developer</h2>
          <div className="max-w-md mx-auto">
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto mb-4 w-32 h-32 bg-gradient-primary rounded-full flex items-center justify-center text-white text-4xl font-bold">
                  HK
                </div>
                <CardTitle className="text-2xl">Harsh Kumar</CardTitle>
                <CardDescription className="font-medium text-primary text-lg">Full-Stack Developer</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Passionate software engineer specializing in building intelligent e-commerce solutions 
                  with NLP-powered search, React, FastAPI, MongoDB, and Elasticsearch.
                </p>
                <div className="flex justify-center gap-4 text-sm text-muted-foreground">
                  <span>🎓 BTech AI/ML</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center py-16 bg-muted/30 rounded-lg">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Shopping?</h2>
          <p className="text-muted-foreground mb-6">
            Join thousands of satisfied customers and discover amazing products today.
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg" onClick={() => navigate('/products')}>Browse Products</Button>
            <Button variant="outline" size="lg" onClick={() => toast({ title: "Contact Us", description: "Email: harshkumar@example.com" })}>Contact Us</Button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default About; 