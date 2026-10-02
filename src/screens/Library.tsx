import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, BookOpen, ChevronRight, FileText, X } from 'lucide-react';
import { ChipGroup } from '../components/ui/Chips';
import { mockApi } from '../mock/api';

const CATEGORIES = [
  { value: 'All', label: 'All guides' },
  { value: 'Equipment', label: 'Equipment' },
  { value: 'Medications', label: 'Medications' },
  { value: 'Wound care', label: 'Wound care' },
  { value: 'Emergencies', label: 'Emergencies' },
];

export const Library: React.FC = () => {
  const navigate = useNavigate();
  const [guides, setGuides] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    let isMounted = true;
    mockApi.getGuides().then((data) => {
      if (isMounted) {
        setGuides(data);
        setLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredGuides = guides.filter((g) => {
    const matchesCat = selectedCategory === 'All' || g.category === selectedCategory;
    const matchesSearch =
      g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="min-h-full flex flex-col justify-between p-5 max-w-[440px] mx-auto animate-fade-in text-left">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <button
            type="button"
            onClick={() => navigate('/menu')}
            className="inline-flex items-center gap-1.5 text-[15px] font-medium text-ink-2 hover:text-primary transition-colors cursor-pointer py-1 -ml-1 pr-3"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
          <span className="text-[12px] font-mono text-ink-muted">VIEW-ONLY REPOSITORY</span>
        </div>

        <h1 className="font-heading text-[26px] sm:text-[28px] font-medium text-ink mb-1">
          Guides & Procedures
        </h1>
        <p className="text-[14px] text-ink-2 mb-4">
          Read-only clinical manuals, pump guides, and care protocols approved for home use.
        </p>

        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="w-4 h-4 text-ink-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search guides (e.g. pump, injection, PICC)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-[48px] pl-10 pr-9 rounded-md bg-surface text-ink text-[15px] border border-line-strong focus:outline-none focus:border-primary focus:ring-2 focus:ring-secondary/60"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Chips */}
        <div className="mb-5 overflow-x-auto custom-scroll pb-1">
          <ChipGroup
            options={CATEGORIES}
            value={selectedCategory}
            onChange={(val) => setSelectedCategory(val)}
          />
        </div>

        {/* Guide List */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="p-4 rounded-lg bg-surface border border-line animate-pulse flex items-center gap-3.5"
              >
                <div className="w-10 h-10 rounded-md bg-line" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-line rounded w-3/4" />
                  <div className="h-3 bg-line rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredGuides.length === 0 ? (
          <div className="p-8 text-center bg-surface rounded-lg border border-line">
            <BookOpen className="w-8 h-8 text-ink-muted mx-auto mb-2 opacity-50" />
            <h3 className="font-heading text-[17px] font-medium text-ink mb-1">
              No guides match that search
            </h3>
            <p className="text-[13px] text-ink-2 max-w-[260px] mx-auto mb-4">
              Try fewer words or browse all categories above.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="text-[13px] text-primary underline font-medium cursor-pointer"
            >
              Reset filters
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredGuides.map((guide) => (
              <button
                key={guide.id}
                onClick={() => navigate(`/library/${guide.id}`)}
                className="w-full p-4 rounded-lg bg-surface border border-line hover:border-line-strong transition-all duration-150 text-left flex items-center justify-between gap-3 group cursor-pointer shadow-sh-1 active:scale-[0.99]"
              >
                <div className="flex items-start gap-3.5 min-w-0">
                  <div className="w-10 h-10 rounded-md bg-secondary text-primary shrink-0 flex items-center justify-center mt-0.5 group-hover:scale-105 transition-transform">
                    <FileText className="w-5 h-5 stroke-[1.8]" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-heading text-[16px] font-medium text-ink leading-snug group-hover:text-primary transition-colors">
                      {guide.title}
                    </h3>
                    <p className="text-[12px] text-ink-muted mt-1">
                      {guide.pagesCount} pages · Updated {guide.updated} · {guide.category}
                    </p>
                  </div>
                </div>

                <ChevronRight className="w-5 h-5 text-ink-muted group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Footer view-only reminder */}
      <div className="pt-6 pb-2 text-center text-[12px] text-ink-muted">
        Protected clinical guides · Non-downloadable view only
      </div>
    </div>
  );
};
