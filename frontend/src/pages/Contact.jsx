import { useState } from "react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const { toast } = useToast();

  const handleSearch = (query) => {
    console.log("Search query:", query);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Simple form validation
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    // Simulate form submission
    toast({
      title: "Message sent!",
      description: "We'll get back to you within 24 hours.",
    });

    // Reset form
    setFormData({
      name: "",
      email: "",
      subject: "",
      message: ""
    });
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      content: "support@cartella.com",
      description: "Send us an email anytime"
    },
    {
      icon: Phone,
      title: "Phone",
      content: "+1 (555) 123-4567",
      description: "Mon-Fri from 8am to 5pm"
    },
    {
      icon: MapPin,
      title: "Address",
      content: "BIT Mesra",
      description: "Ranchi, Jharkhand"
    },
    {
      icon: Clock,
      title: "Business Hours",
      content: "Monday - Friday: 8am - 5pm",
      description: "Weekend: 10am - 3pm"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header onSearch={handleSearch} cartCount={0} />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <section className="text-center py-16 mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
            Contact Us
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-in">
            Have a question or need help? We'd love to hear from you. 
            Send us a message and we'll respond as soon as possible.
          </p>
        </section>

        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Contact Form */}
          <Card>
            <CardHeader>
              <CardTitle>Send us a message</CardTitle>
              <CardDescription>
                Fill out the form below and we'll get back to you within 24 hours.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-2">
                      Name *
                    </label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Your full name"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2">
                      Email *
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="your.email@example.com"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium mb-2">
                    Subject
                  </label>
                  <Input
                    id="subject"
                    name="subject"
                    type="text"
                    value={formData.subject}
                    onChange={handleInputChange}
                    placeholder="What's this about?"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2">
                    Message *
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Tell us how we can help you..."
                    rows={5}
                    required
                  />
                </div>
                
                <Button type="submit" size="lg" className="w-full">
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-4">Get in touch</h2>
              <p className="text-muted-foreground mb-6">
                We're here to help and answer any question you might have. 
                We look forward to hearing from you.
              </p>
            </div>

            <div className="grid gap-4">
              {contactInfo.map((info, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-4">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <info.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{info.title}</h3>
                        <p className="text-sm font-medium">{info.content}</p>
                        <p className="text-xs text-muted-foreground">{info.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">Need immediate help?</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Check out our FAQ section or live chat for instant support.
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">View FAQ</Button>
                  <Button size="sm">Live Chat</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Map Section (Placeholder) */}
        <section className="mb-16">
          <Card>
            <CardContent className="p-0">
              <div className="bg-muted h-64 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">Interactive map would be here</p>
                  <p className="text-sm text-muted-foreground">BIT Mesra, Ranchi, Jharkhand</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
};

export default Contact; 