import image_0cdbc89b9b6cccd3d74435f25902f8d982dd8199 from 'figma:asset/0cdbc89b9b6cccd3d74435f25902f8d982dd8199.png';
import { Link } from 'react-router';
import { Button } from './Button';
import logo from "figma:asset/0cdbc89b9b6cccd3d74435f25902f8d982dd8199.png";

interface HeaderProps {
  isAuthenticated?: boolean;
}

export function Header({ isAuthenticated = false }: HeaderProps) {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 h-[91px] w-[315px] overflow-hidden">
          <img src={logo} alt="Medboro Logo" className="h-[240px] w-[800px] object-contain" />
        </Link>
        
        {!isAuthenticated && (
          <nav className="hidden md:flex items-center gap-8">
            <a href="#home" className="text-gray-700 hover:text-cyan-600 transition-colors">Home</a>
            <a href="#features" className="text-gray-700 hover:text-cyan-600 transition-colors">Features</a>
            <a href="#how-it-works" className="text-gray-700 hover:text-cyan-600 transition-colors">How It Works</a>
            <a href="#contact" className="text-gray-700 hover:text-cyan-600 transition-colors">Contact</a>
            <Link to="/signin">
              <Button variant="outline" size="sm">Sign In</Button>
            </Link>
            <Link to="/signup">
              <Button size="sm">Sign Up</Button>
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}