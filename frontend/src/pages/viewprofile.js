import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './viewprofile.css';


export default function RedditProfilePageMock() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Bar */}
      <header className="fixed top-0 left-0 right-0 h-12 bg-white border-b border-gray-300 z-50 flex items-center px-4">
        <div className="flex items-center gap-4 flex-1 max-w-7xl mx-auto">
          <img
            src="https://www.redditstatic.com/desktop2x/img/favicon/apple-icon-57x57.png"
            alt="Reddit"
            className="w-8 h-8"
          />
          <span className="text-xl font-bold text-orange-600 hidden sm:block">reddit</span>

          <div className="flex-1 max-w-md mx-4">
            <div className="relative">
              <span className="absolute left-3 top-2.5 h-5 w-5 text-gray-400">🔍</span>
              <input
                type="text"
                placeholder="Search in u/Tough-Sherbert-2286"
                className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-full text-sm focus:outline-none"
                defaultValue="u/Tough-Sherbert-2286"
                readOnly
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="w-6 h-6 text-gray-600 flex items-center justify-center">🔔</span>
            <span className="w-6 h-6 text-gray-600 flex items-center justify-center">✉️</span>
            <div className="px-4 py-1.5 bg-orange-500 text-white rounded-full text-sm font-medium">
              Create
            </div>
            <div className="w-8 h-8 bg-orange-200 rounded-full border-2 border-dashed border-orange-400" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="pt-12 flex max-w-7xl mx-auto">
        {/* Left Sidebar */}
        <aside className="w-64 hidden lg:block pt-6 px-4">
          <nav className="space-y-1">
            {["Home", "Popular", "Answers", "Explore", "All"].map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-200"
              >
                <span className="w-6 h-6 flex items-center justify-center">⬜</span>
                <span>{item}</span>
              </div>
            ))}
            <hr className="my-4 border-gray-300" />
            <div className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-200">
              <span className="w-6 h-6 flex items-center justify-center">➕</span>
              <span>Start a community</span>
            </div>
          </nav>

          <div className="mt-8">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
              Games on Reddit
            </h3>
            <div className="space-y-3">
              {["Pocket Grids", "Hot and Cold", "Farm Merge Valley", "Ninigrams"].map((game) => (
                <div key={game} className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg border-2 border-dashed flex items-center justify-center">
                    🎮
                  </div>
                  <div className="font-medium">{game}</div>
                </div>
              ))}
              <div className="text-sm text-blue-600 hover:underline">Discover More Games</div>
            </div>
          </div>
        </aside>

        {/* Center - Profile */}
        <main className="flex-1 border-x border-gray-300 min-h-screen bg-white">
          {/* Profile Header */}
          <div className="h-32 bg-gradient-to-r from-blue-900 to-blue-700 relative">
            <div className="absolute -bottom-12 left-8">
              <div className="w-24 h-24 bg-orange-200 rounded-full border-4 border-white flex items-center justify-center">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center" />
              </div>
            </div>
          </div>

          <div className="pt-16 px-8 pb-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-2xl font-bold">Tough-Sherbert-2286</h1>
                <p className="text-gray-600">u/Tough-Sherbert-2286</p>
              </div>
              <span className="p-2 rounded-full">⋯</span>
            </div>

            {/* Tabs */}
            <div className="flex gap-6 border-b border-gray-300 mb-6">
              {["Overview", "Posts", "Comments", "Saved"].map((tab, i) => (
                <div
                  key={tab}
                  className={`pb-3 px-1 text-sm font-medium border-b-2 ${
                    i === 0 ? "text-blue-600 border-blue-600" : "text-gray-500 border-transparent"
                  }`}
                >
                  {tab}
                </div>
              ))}
            </div>

            <div className="flex items-center gap-3 text-sm text-gray-500 mb-6">
              <span>Showing all content</span>
              <span className="w-4 h-4">⬇️</span>
            </div>

            <div className="flex items-center gap-3 px-6 py-3 border border-gray-300 rounded-full hover:bg-gray-50 mb-12">
              <span className="w-6 h-6 flex items-center justify-center">➕</span>
              <span className="font-medium">Create Post</span>
            </div>

            {/* Empty State */}
            <div className="text-center py-20">
              <div className="w-32 h-32 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                🎨
              </div>
              <h2 className="text-2xl font-bold mb-2">You don't have any posts yet</h2>
              <p className="text-gray-600 mb-6">
                Once you post to a community, it'll show up here. If you'd rather hide your posts, update your settings.
              </p>
              <div className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700">
                Update Settings
              </div>
            </div>
          </div>
        </main>

        {/* Right Sidebar */}
        <aside className="w-80 pt-6 px-6 hidden xl:block">
          <div className="bg-gray-50 rounded-lg p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-orange-200 rounded-full border-2 border-dashed border-orange-400" />
                <div>
                  <div className="font-bold">Tough-Sherbert-2286</div>
                </div>
              </div>
              <span className="text-gray-500 p-2 rounded-full">🔗</span>
            </div>

            <div className="space-y-4 text-sm">
              {["Followers", "Karma", "Reddit Age", "Contributions", "Gold earned"].map((label) => (
                <div key={label} className="flex justify-between">
                  <span className="text-gray-600">{label}</span>
                  <span className="font-medium">0</span>
                </div>
              ))}
            </div>

            <hr className="my-5 border-gray-300" />

            <div>
              <div className="font-bold mb-3">Achievements</div>
              <div className="flex flex-wrap gap-2 mb-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-gray-200 border-2 border-dashed rounded-lg w-12 h-12" />
                ))}
              </div>
              <p className="text-sm text-gray-600">Banana Baby, Feed Finder, Joined Reddit +1 more</p>
              <p className="text-xs text-gray-500 mt-1">4 unlocked</p>
              <div className="text-sm text-blue-600 hover:underline mt-2">View All</div>
            </div>

            <hr className="my-5 border-gray-300" />

            <div className="text-sm font-bold text-gray-600 uppercase tracking-wider">Settings</div>
          </div>
        </aside>
      </div>
    </div>
  );
}
