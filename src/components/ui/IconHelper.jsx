import { Activity, AlertTriangle, ArrowLeft, BarChart2, BookOpen, Check, ChevronRight, Clock, Copy, CornerDownRight, Disc, Download, GitMerge, GraduationCap, Headphones, HelpCircle, Home, Info, Layers, Layout, Lightbulb, List, Mic2, Move, MoveVertical, Music, Play, Radio, Scissors, Settings, Sliders, Sparkles, Speaker, Star, Volume2, X, Youtube, Zap } from 'lucide-react';

export const IconHelper = ({ name, size = 24, className }) => {
  const icons = {
    Mic2, Sliders, Play, Info, Home, Activity, Volume2, Settings,
    Speaker, Radio, Download, ChevronRight, ArrowLeft, Layers,
    X, Music, Sparkles, BarChart2, Zap, CornerDownRight, Check,
    AlertTriangle, Clock, List, Star, HelpCircle, Lightbulb,
    MoveVertical, Copy, Scissors, Disc, GitMerge, Move, Headphones,
    Layout, BookOpen, Youtube, GraduationCap
  };
  const IconComponent = icons[name] || Activity;
  return <IconComponent size={size} className={className} />;
};
