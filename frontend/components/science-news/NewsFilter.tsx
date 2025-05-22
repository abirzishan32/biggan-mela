import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search, Filter } from 'lucide-react';

interface NewsFilterProps {
  onFilterChange: (category: string) => void;
  onSearchChange: (searchTerm: string) => void;
}

const CATEGORIES = [
  { value: 'science', label: 'বিজ্ঞান' },
  { value: 'technology', label: 'প্রযুক্তি' },
  { value: 'health', label: 'স্বাস্থ্য' },
  { value: 'environment', label: 'পরিবেশ' }
];

export default function NewsFilter({ onFilterChange, onSearchChange }: NewsFilterProps) {
  const [searchTerm, setSearchTerm] = useState('');
  
  const handleSearch = () => {
    onSearchChange(searchTerm);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };
  
  return (
    <div className="w-full bg-gray-900/50 border border-gray-800 rounded-lg p-4 mb-6">
      <h2 className="text-white mb-4 font-medium">বিজ্ঞান সংবাদ ফিল্টার</h2>
      
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input 
            placeholder="খুঁজুন..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
            className="pl-9 bg-gray-950 border-gray-700"
          />
        </div>
        
        {/* Category select */}
        <div className="w-full sm:w-64 flex items-center gap-2">
          <Filter size={16} className="text-gray-500" />
          <Select onValueChange={onFilterChange}>
            <SelectTrigger className="bg-gray-950 border-gray-700">
              <SelectValue placeholder="বিভাগ নির্বাচন করুন" />
            </SelectTrigger>
            <SelectContent className="bg-gray-950 border-gray-800">
              {CATEGORIES.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Search button */}
        <Button 
          variant="default" 
          onClick={handleSearch} 
          className="bg-purple-600 hover:bg-purple-700"
        >
          অনুসন্ধান
        </Button>
      </div>
    </div>
  );
}