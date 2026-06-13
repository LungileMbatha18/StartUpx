import React from "react";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <img src="https://media.base44.com/images/public/6a2b14df3205ca651c983800/c5f3072e7_BridgeWork_logo.png" alt="BridgeWork" className="h-8 w-auto" />
              <span className="font-display text-lg font-bold">StartupX</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
              A BridgeWork initiative in partnership with the UFS Business Incubator and Enactus UFS Bloemfontein.
              Building tomorrow's leaders through innovation and social impact.
            </p>
          </div>
          <div>
            <h4 className="font-heading font-semibold text-sm mb-4">Platform</h4>
            <div className="flex flex-col gap-2">
              <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">About</Link>
              <Link to="/impact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Impact</Link>
            </div>
          </div>
          <div>
            <h4 className="font-heading font-semibold text-sm mb-4">Register</h4>
            <div className="flex flex-col gap-2">
              <Link to="/register/student" className="text-sm text-muted-foreground hover:text-foreground transition-colors">As Student</Link>
              <Link to="/register/business" className="text-sm text-muted-foreground hover:text-foreground transition-colors">As Business</Link>
            </div>
          </div>
        </div>
        <div className="border-t mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} StartupX Platform. All rights reserved.</p>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            Made with <Heart className="w-3 h-3 text-destructive fill-destructive" /> by BridgeWork & Enactus UFS
          </p>
        </div>
      </div>
    </footer>
  );
}