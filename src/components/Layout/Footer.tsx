import React from 'react';
import { Button } from '@/components/ui/button';
import { ContactDropdown } from '@/components/ContactDropdown';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-muted border-t border-border mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          <div className="text-sm text-muted-foreground">
            © 2024 TN Academy. All rights reserved.
          </div>
          
          <div className="flex space-x-6">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              이용약관
            </Button>
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              개인정보처리방침
            </Button>
            <ContactDropdown />
          </div>
        </div>
      </div>
    </footer>
  );
};