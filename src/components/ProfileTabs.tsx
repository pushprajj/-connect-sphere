// src/components/ProfileTabs.tsx
'use client';
import { useState, useRef, useLayoutEffect, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { FaBriefcase, FaMapMarkerAlt, FaGlobe, FaEdit, FaCamera, FaUsers, FaCalendar, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import ImageUploadModal from './ImageUploadModal';

interface Update {
  id: string;
  title: string;
  date: string;
  content: string;
}


function ResponsiveTabs({ tabs, activeTab, setActiveTab }: { tabs: any[]; activeTab: string; setActiveTab: (id: string) => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleCount, setVisibleCount] = useState(tabs.length);
  const [moreOpen, setMoreOpen] = useState(false);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const moreButtonRef = useRef<HTMLButtonElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Close dropdown only when clicking outside
  useEffect(() => {
    if (!moreOpen) return;
    function handlePointerDown(e: PointerEvent) {
      setTimeout(() => {
        if (
          moreButtonRef.current && moreButtonRef.current.contains(e.target as Node)
        ) return;
        if (
          dropdownRef.current && dropdownRef.current.contains(e.target as Node)
        ) return;
        setMoreOpen(false);
      }, 0);
    }
    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [moreOpen]);

  useLayoutEffect(() => {
    function updateTabs() {
      if (!containerRef.current) return;
      const containerWidth = containerRef.current.offsetWidth;
      let used = 0;
      let fitCount = tabs.length;
      for (let i = 0; i < tabs.length; i++) {
        const tab = tabRefs.current[i];
        if (!tab) continue;
        used += tab.offsetWidth;
        // 80px is the approx width of the 'More' button
        if (used + 80 > containerWidth) {
          fitCount = i;
          break;
        }
      }
      setVisibleCount(fitCount);
      if (fitCount < tabs.length) {
        console.log('Tabs moved to More:', tabs.slice(fitCount).map(t => t.label));
      } else {
        console.log('All tabs visible');
      }
    }
    updateTabs();
    // Use ResizeObserver for more robust resize handling
    const observer = new window.ResizeObserver(updateTabs);
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    window.addEventListener('resize', updateTabs);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateTabs);
    };
  }, [tabs]);

  const visibleTabs = tabs.slice(0, visibleCount);
  const overflowTabs = tabs.slice(visibleCount);

  return (
    <div className="flex flex-nowrap space-x-4 relative overflow-x-hidden w-full" ref={containerRef}>
      {visibleTabs.map((tab, i) => (
        <button
          key={tab.id}
          ref={el => { tabRefs.current[i] = el; }}
          onClick={() => setActiveTab(tab.id)}
          className={`min-w-[110px] px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 ${activeTab === tab.id ? 'text-black font-semibold border-b-2 border-black' : ''}`}
        >
          {tab.label}
        </button>
      ))}
      {/* Close dropdown when clicking outside */}
      {moreOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setMoreOpen(false)}
          aria-hidden="true"
        />
      )}
      {overflowTabs.length > 0 && (
        <div className="relative z-50 ml-4">
          <button
            ref={moreButtonRef}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 flex items-center"
            onClick={e => { e.stopPropagation(); setMoreOpen(v => !v); }}
            aria-haspopup="true"
            aria-expanded={moreOpen}
            type="button"
          >
            More <FaChevronDown className="ml-1 w-3 h-3" />
          </button>
          {moreOpen && (
            <div
              ref={dropdownRef}
              className="absolute right-0 mt-2 w-44 bg-white border rounded shadow-lg z-50"
            >
              {overflowTabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => { setActiveTab(tab.id); setMoreOpen(false); }}
                  className={`block w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 ${activeTab === tab.id ? 'text-black font-semibold' : ''}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function ProfileTabs({ user, business }: { user: any; business: any }) {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState('home');
  const [isLogoModalOpen, setIsLogoModalOpen] = useState(false);
  const [isBackgroundModalOpen, setIsBackgroundModalOpen] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const isOwnProfile = session?.user?.username === user?.username;

  // Sample updates data - replace with actual data from your backend
  const updates: Update[] = [
    {
      id: '1',
      title: 'New Product Launch',
      date: '2024-03-15',
      content: 'We are excited to announce our new product line launching next month!',
    },
    {
      id: '2',
      title: 'Company Milestone',
      date: '2024-03-10',
      content: 'We have reached 10,000 customers! Thank you for your support.',
    },
  ];

  const tabs = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About Us' },
    { id: 'products', label: 'Products/Services' },
    { id: 'people', label: 'People' },
    { id: 'contact', label: 'Contact' },
    { id: 'updates', label: 'Updates' },
  ];

  const defaultBackground = '/default-background.jpg';
  const defaultLogo = '/default-logo.png';

  const handleLogoUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('logo', file);
    formData.append('userId', user.id);

    const response = await fetch('/api/business/logo', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload logo');
    }

    // Refresh the page to show the new logo
    window.location.reload();
  };

  const handleBackgroundUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('background', file);
    formData.append('userId', user.id);

    const response = await fetch('/api/business/background', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload background image');
    }

    // Refresh the page to show the new background
    window.location.reload();
  };

  const EditButton = ({ onClick }: { onClick: () => void }) => (
    <button
      onClick={onClick}
      className="ml-2 text-gray-400 hover:text-indigo-600 transition-colors"
    >
      <FaEdit className="w-4 h-4" />
    </button>
  );

  return (
    <div className="bg-[#f3f2ef] min-h-screen w-full">
      <div className="max-w-[1128px] mx-auto grid grid-cols-12 gap-4 pt-6">
        {/* Main Content (Left) */}
        <div className="col-span-12 md:col-span-8 lg:col-span-9 space-y-4">
          <div className="bg-white border-b border-gray-200 rounded-xl overflow-hidden">
            <div className="relative h-48 w-full rounded-t-xl">
              <Image
                src={business.background_image || defaultBackground}
                alt="Background"
                fill
                className="object-cover"
                priority
              />
              {isOwnProfile && (
                <button
                  onClick={() => setIsBackgroundModalOpen(true)}
                  className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
                >
                  <FaCamera className="w-4 h-4 text-gray-600" />
                </button>
              )}
            </div>
            <div className="relative px-6 pb-6">
              <div className="flex flex-col">
                <div className="relative w-36 h-36 -mt-20 border-4 border-white rounded-full object-cover">
                  <Image
                    src={business.logo || defaultLogo}
                    alt="Logo"
                    fill
                    className="object-cover rounded-full"
                  />
                  {isOwnProfile && (
                    <button
                      onClick={() => setIsLogoModalOpen(true)}
                      className="absolute bottom-0 right-0 bg-white p-1 rounded-full shadow-md hover:bg-gray-100"
                    >
                      <FaCamera className="w-3 h-3 text-gray-600" />
                    </button>
                  )}
                </div>
                <div>
                  <div className="flex items-center">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">{business.name}</h1>
                    {isOwnProfile && (
                      <Link href="/profile/edit" className="ml-2 text-gray-400 hover:text-indigo-600">
                        <FaEdit className="w-5 h-5" />
                      </Link>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-gray-600 text-sm mt-3">
                    <div className="flex items-center">
                      <FaBriefcase className="w-4 h-4 mr-1" />
                      <span>{business.description?.split('Industry: ')[1] || 'Not specified'}</span>
                    </div>
                    <div className="flex items-center">
                      <FaMapMarkerAlt className="w-4 h-4 mr-1" />
                      <span>{business.location || 'Not provided'}</span>
                    </div>
                    <div className="flex items-center">
                      <FaGlobe className="w-4 h-4 mr-1" />
                      <span>{business.website || 'Not provided'}</span>
                    </div>
                    {business.size && (
                      <div className="flex items-center">
                        <FaUsers className="w-4 h-4 mr-1" />
                        <span>{business.size}</span>
                      </div>
                    )}
                    {business.founded_year && (
                      <div className="flex items-center">
                        <FaCalendar className="w-4 h-4 mr-1" />
                        <span>Founded {business.founded_year}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Description Section */}
                {business.description && (
                  <div className="mt-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-800">About</h3>
                      {isOwnProfile && (
                        <Link href="/profile/edit" className="text-gray-400 hover:text-indigo-600">
                          <FaEdit className="w-4 h-4" />
                        </Link>
                      )}
                    </div>
                    <div className="mt-2">
                      <p className={`text-gray-600 ${!showFullDescription ? 'line-clamp-3' : ''}`}>
                        {business.description}
                      </p>
                      {business.description.length > 150 && (
                        <button
                          onClick={() => setShowFullDescription(!showFullDescription)}
                          className="mt-2 text-indigo-600 hover:text-indigo-800 flex items-center text-sm"
                        >
                          {showFullDescription ? (
                            <>
                              Show less <FaChevronUp className="ml-1 w-3 h-3" />
                            </>
                          ) : (
                            <>
                              Show more <FaChevronDown className="ml-1 w-3 h-3" />
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {!isOwnProfile && (
                  <div className="flex flex-wrap gap-4 mt-4">
                    <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
                      Connect
                    </button>
                    <button className="bg-white text-indigo-600 px-4 py-2 rounded-md border border-indigo-600 hover:bg-indigo-50">
                      Follow
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white border-t border-gray-200 shadow-none rounded-xl">
            <div>
              <nav className="flex items-center justify-between px-4 py-2 border-b border-gray-200">
  <div className="flex space-x-4 overflow-x-auto flex-nowrap w-full scrollbar-hide">
    {tabs.map((tab) => (
      <button
        key={tab.id}
        onClick={() => setActiveTab(tab.id)}
        className={`px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 ${activeTab === tab.id ? 'text-black font-semibold border-b-2 border-black' : ''}`}
      >
        {tab.label}
      </button>
    ))}
  </div>
                {isOwnProfile && (
                  <div className="flex items-center space-x-2">
                    <button className="text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-md text-sm font-medium">
                      Create post
                    </button>
                    <button className="text-gray-600 hover:bg-gray-100 p-2 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="1"></circle>
                        <circle cx="12" cy="5" r="1"></circle>
                        <circle cx="12" cy="19" r="1"></circle>
                      </svg>
                    </button>
                  </div>
                )}
              </nav>
            </div>
            <div className="p-4 sm:p-6">
              {activeTab === 'home' && (
                <div className="space-y-6">
                  {/* Updates Section */}
                  <div className="bg-white shadow rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Updates</h3>
                    <div className="space-y-4">
                      {updates.map((update) => (
                        <div key={update.id} className="border-b border-gray-200 pb-4">
                          <div className="flex items-center justify-between">
                            <h4 className="text-md font-medium text-gray-900">
                              {update.title}
                            </h4>
                            <span className="text-sm text-gray-500">{update.date}</span>
                          </div>
                          <p className="mt-2 text-gray-600">{update.content}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              {activeTab === 'about' && (
                <div>
                  <div className="flex items-center">
                    <h2 className="text-xl font-semibold text-gray-800">About Us</h2>
                    {isOwnProfile && <EditButton onClick={() => {}} />}
                  </div>
                  <p className="text-gray-600 mt-2">{business.description || 'No about info yet.'}</p>
                </div>
              )}
              {activeTab === 'products' && (
                <div>
                  <div className="flex items-center">
                    <h2 className="text-xl font-semibold text-gray-800">Products/Services</h2>
                    {isOwnProfile && <EditButton onClick={() => {}} />}
                  </div>
                  <p className="text-gray-600 mt-2">Products and services coming soon.</p>
                </div>
              )}
              {activeTab === 'people' && (
                <div>
                  <div className="flex items-center">
                    <h2 className="text-xl font-semibold text-gray-800">People</h2>
                    {isOwnProfile && <EditButton onClick={() => {}} />}
                  </div>
                  <div className="mt-2">
                    <p className="text-gray-600">{user.full_name || user.username} - Owner</p>
                    {business.contact_person_name && (
                      <p className="text-gray-600">{business.contact_person_name} - Contact</p>
                    )}
                  </div>
                </div>
              )}
              {activeTab === 'contact' && (
                <div>
                  <div className="flex items-center">
                    <h2 className="text-xl font-semibold text-gray-800">Contact</h2>
                    {isOwnProfile && <EditButton onClick={() => {}} />}
                  </div>
                  <div className="mt-2">
                    <p className="text-gray-600">Website: {business.website || 'Not provided'}</p>
                    {business.contact_person_name && (
                      <p className="text-gray-600">Contact: {business.contact_person_name}</p>
                    )}
                  </div>
                </div>
              )}
              {activeTab === 'updates' && (
                <div>
                  <div className="flex items-center">
                    <h2 className="text-xl font-semibold text-gray-800">Updates</h2>
                    {isOwnProfile && <EditButton onClick={() => {}} />}
                  </div>
                  <p className="text-gray-600 mt-2">Latest posts and updates coming soon.</p>
                </div>
              )}
            </div>
          </div>

          {/* Image Upload Modals */}
          {isLogoModalOpen && (
            <ImageUploadModal
              isOpen={isLogoModalOpen}
              onClose={() => setIsLogoModalOpen(false)}
              onUpload={handleLogoUpload}
              currentImage={business.logo}
              title="Update Logo"
              userId={user.id}
            />
          )}
          {isBackgroundModalOpen && (
            <ImageUploadModal
              isOpen={isBackgroundModalOpen}
              onClose={() => setIsBackgroundModalOpen(false)}
              onUpload={handleBackgroundUpload}
              currentImage={business.background_image}
              title="Update Background"
              userId={user.id}
            />
          )}
        </div>

        {/* Sidebar (Right) */}
        <aside className="col-span-12 md:col-span-4 lg:col-span-3 space-y-4">
          <div className="bg-white border border-gray-200 rounded-lg p-4 sticky top-4">
            <div className="flex items-center">
              <h3 className="text-lg font-semibold text-gray-800">Updates & Insights</h3>
              {isOwnProfile && <EditButton onClick={() => {}} />}
            </div>
            <div className="space-y-4 mt-4">
              <div className="bg-gray-100 p-4 rounded-md">
                <p className="text-gray-600">Ad Space or Latest Update Here</p>
              </div>
              <div className="bg-gray-100 p-4 rounded-md">
                <p className="text-gray-600">Analytics Snapshot Coming Soon</p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}