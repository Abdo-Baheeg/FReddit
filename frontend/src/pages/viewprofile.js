import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function RedditProfilePage() {
  const [userData, setUserData] = useState({
    username: 'Tough-Sherbert-2286',
    displayName: 'Tough-Sherbert-2286',
    avatar: '',
    followers: 0,
    karma: 1,
    redditAge: '1 m',
    gold: 0,
  });

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) setUserData(storedUser);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 font-sans text-sm">
      <div className="fixed top-0 left-0 right-0 h-12 bg-white border-b border-gray-300 flex items-center px-4 z-50">
        <div className="flex items-center space-x-4 flex-1">
          <div className="text-xs text-gray-500">
            Go back one page (Alt+Left Arrow)<br />
            Right-click or pull down to show history
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder={`Search in u/${userData.username}`}
              className="w-80 pl-10 pr-4 py-2 bg-gray-200 rounded-full text-sm focus:outline-none"
            />
            <div className="absolute left-3 top-2.5 flex items-center space-x-1">
              <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">u/</span>
              </div>
              <span className="text-gray-700">{userData.username}</span>
            </div>
          </div>
          <button className="w-8 h-8 rounded-full hover:bg-gray-200 flex items-center justify-center">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <button className="w-8 h-8 rounded-full hover:bg-gray-200 flex items-center justify-center">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </button>
          <button className="w-8 h-8 rounded-full hover:bg-gray-200 flex items-center justify-center">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </button>
          <button className="text-gray-600 hover:text-gray-900">Create</button>
          <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
            {userData.displayName[0].toUpperCase()}
          </div>
        </div>
      </div>

      <div className="pt-12 flex">
        <div className="w-80 bg-white border-r border-gray-300 min-h-screen">
          <div className="p-6">
            <div className="h-20 bg-gradient-to-r from-blue-900 to-blue-700 rounded-t-lg"></div>
            <div className="relative -mt-10 flex items-end">
              <div className="w-24 h-24 bg-orange-500 rounded-full border-4 border-white flex items-center justify-center text-white text-4xl font-bold">
                {userData.displayName[0].toUpperCase()}
              </div>
              <div className="ml-4 pb-4">
                <h1 className="text-2xl font-bold">{userData.displayName}</h1>
                <p className="text-gray-500 text-sm">u/{userData.username}</p>
              </div>
            </div>
            <div className="flex space-x-4 mt-6 border-b border-gray-300">
              {['Overview', 'Posts', 'Comments', 'Saved', 'History', 'Hidden', 'Upvoted', 'Downvoted'].map((tab) => (
                <button
                  key={tab}
                  className={`pb-2 px-1 text-sm font-medium ${tab === 'Overview' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-900'}`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center space-x-2 text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span>Showing all content</span>
              </div>
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>

        <div className="w-80 bg-white ml-4 mt-4 mr-4 rounded-lg shadow-sm border border-gray-300">
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">{userData.displayName}</h3>
            </div>
            <button className="w-full bg-gray-200 hover:bg-gray-300 rounded-full py-2 text-sm font-medium flex items-center justify-center space-x-2">
              <span>Share</span>
            </button>
            <div className="mt-6 space-y-4 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Followers</span>
                <span className="font-medium">{userData.followers}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Karma</span>
                <span className="font-medium">{userData.karma}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Reddit Age</span>
                <span className="font-medium">{userData.redditAge}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Gold earned</span>
                <span className="font-medium">{userData.gold}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
