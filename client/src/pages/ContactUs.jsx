import React, { useEffect, useState } from 'react';
import { Send, CheckCircle, User, Mail, MessageSquare } from 'lucide-react';

const Success = ({ resetForm }) => (
  <div className="fixed inset-0 flex items-center justify-center z-20 p-4">
    <div className="bg-black/30 backdrop-blur-sm absolute inset-0" />
    <div className="relative bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-lg rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/10 text-center max-w-md w-full mx-4 transform animate-in fade-in zoom-in duration-500">
      <div className="mb-6">
        <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mb-4 animate-bounce">
          <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent mb-2">
          Message Sent!
        </h2>
        <p className="text-gray-300 text-base sm:text-lg">
          Thank you for reaching out. We'll get back to you within 24 hours.
        </p>
      </div>
      <button
        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-sm sm:text-base"
        onClick={resetForm}
      >
        Send Another Message
      </button>
    </div>
  </div>
);

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsSubmitted(true);
    } catch (error) {
      alert('Failed to send message.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', email: '', message: '' });
    setIsSubmitted(false);
  };

  useEffect(() => {
    const canvas = document.getElementById('cosmosCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const particles = [];
    const numParticles = window.innerWidth < 768 ? 75 : 150; // Fewer particles on mobile

    class Particle {
      constructor(x, y, radius, speed) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.speed = speed;
        this.angle = Math.random() * Math.PI * 2;
        this.opacity = Math.random() * 0.8 + 0.2;
        this.pulse = Math.random() * 0.02 + 0.01;
      }

      update() {
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;
        this.opacity += this.pulse;
        
        if (this.opacity > 1 || this.opacity < 0.2) {
          this.pulse = -this.pulse;
        }

        if (this.x < 0 || this.x > canvas.width) this.angle = Math.PI - this.angle;
        if (this.y < 0 || this.y > canvas.height) this.angle = -this.angle;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
        gradient.addColorStop(0, `rgba(147, 197, 253, ${this.opacity})`);
        gradient.addColorStop(1, `rgba(59, 130, 246, ${this.opacity * 0.3})`);
        ctx.fillStyle = gradient;
        ctx.fill();
      }
    }

    for (let i = 0; i < numParticles; i++) {
      particles.push(
        new Particle(
          Math.random() * canvas.width,
          Math.random() * canvas.height,
          Math.random() * 3 + 1,
          Math.random() * 0.8 + 0.2
        )
      );
    }

    function connectParticles() {
      const connectionDistance = window.innerWidth < 768 ? 80 : 100; // Shorter connections on mobile
      for (let a = 0; a < particles.length; a++) {
        for (let b = a + 1; b < particles.length; b++) {
          const dist = Math.hypot(
            particles[a].x - particles[b].x,
            particles[a].y - particles[b].y
          );

          if (dist < connectionDistance) {
            const opacity = (1 - dist / connectionDistance) * 0.3;
            ctx.strokeStyle = `rgba(147, 197, 253, ${opacity})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.stroke();
          }
        }
      }
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((particle) => {
        particle.update();
        particle.draw();
      });
      connectParticles();
      requestAnimationFrame(animate);
    }

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <div className="relative overflow-hidden min-h-screen">
      <canvas 
        id="cosmosCanvas" 
        className="absolute inset-0 opacity-40 sm:opacity-60"
      />
      
      {/* Floating orbs - responsive sizing */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-48 h-48 sm:w-72 sm:h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 right-1/3 w-32 h-32 sm:w-48 sm:h-48 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4 py-8 sm:py-4">
        <div className="w-full max-w-2xl">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-blue-600 bg-clip-text text-transparent mb-4 px-4">
              Let's Connect
            </h1>
            <p className="text-lg sm:text-xl text-gray-300 max-w-md mx-auto leading-relaxed px-4">
              Have a question or want to collaborate? We'd love to hear from you.
            </p>
          </div>

          {/* Form Container */}
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-2xl border border-white/10 mx-2 sm:mx-0">
            <div className="space-y-4 sm:space-y-6">
              {/* Name Field */}
              <div className="relative">
                <label 
                  htmlFor="name" 
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  <User className="inline w-4 h-4 mr-2" />
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('name')}
                  onBlur={() => setFocusedField(null)}
                  className={`w-full px-3 sm:px-4 py-3 bg-white/10 border rounded-xl text-white placeholder-gray-400 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base ${
                    focusedField === 'name' ? 'bg-white/15 transform scale-105' : 'border-white/20'
                  }`}
                  required
                />
              </div>

              {/* Email Field */}
              <div className="relative">
                <label 
                  htmlFor="email" 
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  <Mail className="inline w-4 h-4 mr-2" />
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  className={`w-full px-3 sm:px-4 py-3 bg-white/10 border rounded-xl text-white placeholder-gray-400 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base ${
                    focusedField === 'email' ? 'bg-white/15 transform scale-105' : 'border-white/20'
                  }`}
                  required
                />
              </div>

              {/* Message Field */}
              <div className="relative">
                <label 
                  htmlFor="message" 
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  <MessageSquare className="inline w-4 h-4 mr-2" />
                  Your Message
                </label>
                <textarea
                  id="message"
                  rows="5"
                  placeholder="Tell us about your project or inquiry..."
                  value={formData.message}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('message')}
                  onBlur={() => setFocusedField(null)}
                  className={`w-full px-3 sm:px-4 py-3 bg-white/10 border rounded-xl text-white placeholder-gray-400 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm sm:text-base ${
                    focusedField === 'message' ? 'bg-white/15 transform scale-105' : 'border-white/20'
                  }`}
                  required
                />
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-800 text-white font-semibold py-3 sm:py-4 px-6 sm:px-8 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:scale-100 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 text-sm sm:text-base"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-6 sm:mt-8">
            <p className="text-gray-400 text-xs sm:text-sm px-4">
              We typically respond within 24 hours
            </p>
          </div>
        </div>
      </div>

      {isSubmitted && <Success resetForm={resetForm} />}
    </div>
  );
};

export default Contact;