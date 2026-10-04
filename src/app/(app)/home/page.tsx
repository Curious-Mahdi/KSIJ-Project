"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, ChevronRight, Grid, Users, Calendar, Store, ArrowRight, Loader2, Mic, FileText, ClipboardList, Monitor, Activity, BookOpen, Heart } from "lucide-react";
import { useSession } from "next-auth/react";
import { globalSearch } from "@/lib/actions/search";
import styles from "./page.module.css";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";

type Language = 'en' | 'gu' | 'hi';

const translations: Record<Language, Record<string, string>> = {
  en: {
    heroEyebrow: "KSIJ ONE",
    heroGreeting: "Salamun Alaykum",
    heroSubtitle: "One community.<br/>Everything you need.",
    searchPlaceholder: "Search for people, services, properties...",
    searchLabel: "WHAT DO YOU NEED?",
    searchLoading: "Searching the community...",
    searchNoResults: "No results found for",
    searchCommunityServices: "Community Services",
    searchPeoplePro: "People & Professionals",
    searchMarketplace: "Marketplace",
    searchEsc: "Esc",
    bentoServicesTitle: "Community Services",
    bentoServicesDesc: "Support, welfare, medical, education, and housing.",
    bentoDirectoryTitle: "Directory",
    bentoDirectoryDesc: "Find community professionals",
    bentoEventsTitle: "Events",
    bentoEventsDesc: "Join community gatherings",
    bentoMarketplaceTitle: "Marketplace",
    myKsijTitle: "YOUR KSIJ ONE",
    myAppsTitle: "My Applications",
    myAppsDesc: "Track your community assistance requests",
    myDirTitle: "My Directory",
    myDirDesc: "Manage your community listing",
    myUpcomingTitle: "Upcoming",
    myUpcomingDesc: "See events relevant to you",
    myEmptyText: "Your activity will appear here as you use the platform.",
    signIn: "Sign In",
    whatsHappening: "WHAT'S HAPPENING",
    communityUpdates: "COMMUNITY UPDATES",
    viewDetails: "View details",
    readMore: "Read more",
    viewAllUpdates: "View all updates",
    upcomingEvents: "UPCOMING EVENTS",
    viewEvent: "View event",
    communityPulse: "COMMUNITY PULSE",
    pulseUpcomingEvents: "Upcoming Events",
    pulseDirListings: "Directory Listings",
    pulseServices: "Services",
    pulseUpdates: "Updates",
    footerTagline: "One community. Everything you need.",
    navHome: "Home",
    navServices: "Services",
    navDirectory: "Directory",
    navMarketplace: "Marketplace",
    navEvents: "Events"
  },
  gu: {
    heroEyebrow: "KSIJ ONE",
    heroGreeting: "\u0ab8\u0ab2\u0abe\u0aae\u0ac1\u0aa8 \u0a85\u0ab2\u0aaf\u0a95\u0ac1\u0aae",
    heroSubtitle: "\u0a8f\u0a95 \u0ab8\u0aae\u0abe\u0a9c.<br/>\u0aa4\u0aae\u0abe\u0ab0\u0ac0 \u0aac\u0aa7\u0ac0 \u0a9c\u0ab0\u0ac2\u0ab0\u0abf\u0aaf\u0abe\u0aa4\u0acb.",
    searchPlaceholder: "\u0ab2\u0acb\u0a95\u0acb, \u0ab8\u0ac7\u0ab5\u0abe\u0a93, \u0aae\u0abf\u0ab2\u0a95\u0aa4\u0acb \u0ab6\u0acb\u0aa7\u0acb...",
    searchLabel: "\u0aa4\u0aae\u0aa8\u0ac7 \u0ab6\u0ac1\u0a82 \u0a9c\u0acb\u0a88\u0a8f \u0a9b\u0ac7?",
    searchLoading: "\u0ab8\u0aae\u0abe\u0a9c\u0aae\u0abe\u0a82 \u0ab6\u0acb\u0aa7\u0ac0 \u0ab0\u0ab9\u0acd\u0aaf\u0abe \u0a9b\u0ac0\u0a8f...",
    searchNoResults: "\u0aae\u0abe\u0a9f\u0ac7 \u0a95\u0acb\u0a88 \u0aaa\u0ab0\u0abf\u0aa3\u0abe\u0aae \u0aae\u0ab3\u0acd\u0aaf\u0ac1\u0a82 \u0aa8\u0aa5\u0ac0",
    searchCommunityServices: "\u0ab8\u0abe\u0aae\u0ac1\u0aa6\u0abe\u0aaf\u0abf\u0a95 \u0ab8\u0ac7\u0ab5\u0abe\u0a93",
    searchPeoplePro: "\u0ab2\u0acb\u0a95\u0acb \u0a85\u0aa8\u0ac7 \u0ab5\u0acd\u0aaf\u0ab5\u0ab8\u0abe\u0aaf\u0abf\u0a95\u0acb",
    searchMarketplace: "\u0aac\u0a9c\u0abe\u0ab0",
    searchEsc: "Esc",
    bentoServicesTitle: "\u0ab8\u0abe\u0aae\u0ac1\u0aa6\u0abe\u0aaf\u0abf\u0a95 \u0ab8\u0ac7\u0ab5\u0abe\u0a93",
    bentoServicesDesc: "\u0ab8\u0ab9\u0abe\u0aaf, \u0a95\u0ab2\u0acd\u0aaf\u0abe\u0aa3, \u0aa4\u0aac\u0ac0\u0aac\u0ac0, \u0ab6\u0abf\u0a95\u0acd\u0ab7\u0aa3 \u0a85\u0aa8\u0ac7 \u0a86\u0ab5\u0abe\u0ab8.",
    bentoDirectoryTitle: "\u0aa1\u0abf\u0ab0\u0ac7\u0a95\u0acd\u0a9f\u0ab0\u0ac0",
    bentoDirectoryDesc: "\u0ab8\u0aae\u0abe\u0a9c\u0aa8\u0abe \u0ab5\u0acd\u0aaf\u0ab5\u0ab8\u0abe\u0aaf\u0abf\u0a95\u0acb\u0aa8\u0ac7 \u0ab6\u0acb\u0aa7\u0acb",
    bentoEventsTitle: "\u0a87\u0ab5\u0ac7\u0aa8\u0acd\u0a9f\u0acd\u0ab8",
    bentoEventsDesc: "\u0ab8\u0aae\u0abe\u0a9c\u0aa8\u0abe \u0aae\u0ac7\u0ab3\u0abe\u0ab5\u0aa1\u0abe\u0aae\u0abe\u0a82 \u0a9c\u0acb\u0aa1\u0abe\u0a93",
    bentoMarketplaceTitle: "\u0aac\u0a9c\u0abe\u0ab0",
    myKsijTitle: "\u0aa4\u0aae\u0abe\u0ab0\u0ac1\u0a82 KSIJ ONE",
    myAppsTitle: "\u0aae\u0abe\u0ab0\u0ac0 \u0a85\u0ab0\u0a9c\u0ac0\u0a93",
    myAppsDesc: "\u0aa4\u0aae\u0abe\u0ab0\u0ac0 \u0ab8\u0abe\u0aae\u0ac1\u0aa6\u0abe\u0aaf\u0abf\u0a95 \u0ab8\u0ab9\u0abe\u0aaf \u0ab5\u0abf\u0aa8\u0a82\u0aa4\u0ac0\u0a93 \u0a9f\u0acd\u0ab0\u0ac5\u0a95 \u0a95\u0ab0\u0acb",
    myDirTitle: "\u0aae\u0abe\u0ab0\u0ac0 \u0aa1\u0abf\u0ab0\u0ac7\u0a95\u0acd\u0a9f\u0ab0\u0ac0",
    myDirDesc: "\u0aa4\u0aae\u0abe\u0ab0\u0ac1\u0a82 \u0ab8\u0aae\u0ac1\u0aa6\u0abe\u0aaf \u0ab2\u0abf\u0ab8\u0acd\u0a9f\u0abf\u0a82\u0a97 \u0aae\u0ac7\u0aa8\u0ac7\u0a9c \u0a95\u0ab0\u0acb",
    myUpcomingTitle: "\u0a86\u0a97\u0abe\u0aae\u0ac0",
    myUpcomingDesc: "\u0aa4\u0aae\u0abe\u0ab0\u0abe \u0ab8\u0a82\u0aac\u0a82\u0aa7\u0abf\u0aa4 \u0a87\u0ab5\u0ac7\u0aa8\u0acd\u0a9f\u0acd\u0ab8 \u0a9c\u0ac1\u0a93",
    myEmptyText: "\u0aa4\u0aae\u0ac7 \u0aaa\u0acd\u0ab2\u0ac7\u0a9f\u0aab\u0acb\u0ab0\u0acd\u0aae\u0aa8\u0acb \u0a89\u0aaa\u0aaf\u0acb\u0a97 \u0a95\u0ab0\u0ab6\u0acb \u0aa4\u0ac7\u0aae \u0aa4\u0aae\u0abe\u0ab0\u0ac0 \u0aaa\u0acd\u0ab0\u0ab5\u0ac3\u0aa4\u0acd\u0aa4\u0abf \u0a85\u0ab9\u0ac0\u0a82 \u0aa6\u0ac7\u0a96\u0abe\u0ab6\u0ac7.",
    signIn: "\u0ab8\u0abe\u0a87\u0aa8 \u0a87\u0aa8 \u0a95\u0ab0\u0acb",
    whatsHappening: "\u0ab6\u0ac1\u0a82 \u0aa5\u0a88 \u0ab0\u0ab9\u0acd\u0aaf\u0ac1\u0a82 \u0a9b\u0ac7",
    communityUpdates: "\u0ab8\u0abe\u0aae\u0ac1\u0aa6\u0abe\u0aaf\u0abf\u0a95 \u0a85\u0aaa\u0aa1\u0ac7\u0a9f\u0acd\u0ab8",
    viewDetails: "\u0ab5\u0abf\u0a97\u0aa4\u0acb \u0a9c\u0ac1\u0a93",
    readMore: "\u0ab5\u0aa7\u0ac1 \u0ab5\u0abe\u0a82\u0a9a\u0acb",
    viewAllUpdates: "\u0aac\u0aa7\u0abe \u0a85\u0aaa\u0aa1\u0ac7\u0a9f\u0acd\u0ab8 \u0a9c\u0ac1\u0a93",
    upcomingEvents: "\u0a86\u0a97\u0abe\u0aae\u0ac0 \u0a87\u0ab5\u0ac7\u0aa8\u0acd\u0a9f\u0acd\u0ab8",
    viewEvent: "\u0a87\u0ab5\u0ac7\u0aa8\u0acd\u0a9f \u0a9c\u0ac1\u0a93",
    communityPulse: "\u0ab8\u0aae\u0ac1\u0aa6\u0abe\u0aaf \u0aaa\u0ab2\u0acd\u0ab8",
    pulseUpcomingEvents: "\u0a86\u0a97\u0abe\u0aae\u0ac0 \u0a87\u0ab5\u0ac7\u0aa8\u0acd\u0a9f\u0acd\u0ab8",
    pulseDirListings: "\u0aa1\u0abf\u0ab0\u0ac7\u0a95\u0acd\u0a9f\u0ab0\u0ac0 \u0ab2\u0abf\u0ab8\u0acd\u0a9f\u0abf\u0a82\u0a97",
    pulseServices: "\u0ab8\u0ac7\u0ab5\u0abe\u0a93",
    pulseUpdates: "\u0a85\u0aaa\u0aa1\u0ac7\u0a9f\u0acd\u0ab8",
    footerTagline: "\u0a8f\u0a95 \u0ab8\u0aae\u0abe\u0a9c. \u0aa4\u0aae\u0abe\u0ab0\u0ac0 \u0aac\u0aa7\u0ac0 \u0a9c\u0ab0\u0ac2\u0ab0\u0abf\u0aaf\u0abe\u0aa4\u0acb.",
    navHome: "\u0ab9\u0acb\u0aae",
    navServices: "\u0ab8\u0ac7\u0ab5\u0abe\u0a93",
    navDirectory: "\u0aa1\u0abf\u0ab0\u0ac7\u0a95\u0acd\u0a9f\u0ab0\u0ac0",
    navMarketplace: "\u0aac\u0a9c\u0abe\u0ab0",
    navEvents: "\u0a87\u0ab5\u0ac7\u0aa8\u0acd\u0a9f\u0acd\u0ab8"
  },
  hi: {
    heroEyebrow: "KSIJ ONE",
    heroGreeting: "\u0938\u0932\u093e\u092e\u0942\u0928 \u0905\u0932\u0948\u0915\u0941\u092e",
    heroSubtitle: "\u090f\u0915 \u0938\u092e\u0941\u0926\u093e\u092f\u0964<br/>\u0906\u092a\u0915\u0940 \u0939\u0930 \u091c\u0930\u0942\u0930\u0924\u0964",
    searchPlaceholder: "\u0932\u094b\u0917, \u0938\u0947\u0935\u093e\u090f\u0902, \u092a\u094d\u0930\u0949\u092a\u0930\u094d\u091f\u0940\u091c\u093c \u0916\u094b\u091c\u0947\u0902...",
    searchLabel: "\u0906\u092a\u0915\u094b \u0915\u094d\u092f\u093e \u091a\u093e\u0939\u093f\u090f?",
    searchLoading: "\u0938\u092e\u0941\u0926\u093e\u092f \u092e\u0947\u0902 \u0916\u094b\u091c \u0930\u0939\u0947 \u0939\u0948\u0902...",
    searchNoResults: "\u0915\u0947 \u0932\u093f\u090f \u0915\u094b\u0908 \u092a\u0930\u093f\u0923\u093e\u092e \u0928\u0939\u0940\u0902 \u092e\u093f\u0932\u093e",
    searchCommunityServices: "\u0938\u093e\u092e\u0941\u0926\u093e\u092f\u093f\u0915 \u0938\u0947\u0935\u093e\u090f\u0902",
    searchPeoplePro: "\u0932\u094b\u0917 \u0914\u0930 \u092a\u0947\u0936\u0947\u0935\u0930",
    searchMarketplace: "\u092e\u093e\u0930\u094d\u0915\u0947\u091f\u092a\u094d\u0932\u0947\u0938",
    searchEsc: "Esc",
    bentoServicesTitle: "\u0938\u093e\u092e\u0941\u0926\u093e\u092f\u093f\u0915 \u0938\u0947\u0935\u093e\u090f\u0902",
    bentoServicesDesc: "\u0938\u0939\u093e\u092f\u0924\u093e, \u0915\u0932\u094d\u092f\u093e\u0923, \u091a\u093f\u0915\u093f\u0924\u094d\u0938\u093e, \u0936\u093f\u0915\u094d\u0937\u093e \u0914\u0930 \u0906\u0935\u093e\u0938\u0964",
    bentoDirectoryTitle: "\u0928\u093f\u0930\u094d\u0926\u0947\u0936\u093f\u0915\u093e",
    bentoDirectoryDesc: "\u0938\u092e\u0941\u0926\u093e\u092f \u0915\u0947 \u092a\u0947\u0936\u0947\u0935\u0930\u094b\u0902 \u0915\u094b \u0916\u094b\u091c\u0947\u0902",
    bentoEventsTitle: "\u0907\u0935\u0947\u0902\u091f\u094d\u0938",
    bentoEventsDesc: "\u0938\u092e\u0941\u0926\u093e\u092f \u0915\u0947 \u0915\u093e\u0930\u094d\u092f\u0915\u094d\u0930\u092e\u094b\u0902 \u092e\u0947\u0902 \u0936\u093e\u092e\u093f\u0932 \u0939\u094b\u0902",
    bentoMarketplaceTitle: "\u092e\u093e\u0930\u094d\u0915\u0947\u091f\u092a\u094d\u0932\u0947\u0938",
    myKsijTitle: "\u0906\u092a\u0915\u093e KSIJ ONE",
    myAppsTitle: "\u092e\u0947\u0930\u0940 \u090f\u092a\u094d\u0932\u093f\u0915\u0947\u0936\u0928\u094d\u0938",
    myAppsDesc: "\u0905\u092a\u0928\u0947 \u0938\u092e\u0941\u0926\u093e\u092f \u0938\u0939\u093e\u092f\u0924\u093e \u0905\u0928\u0941\u0930\u094b\u0927\u094b\u0902 \u0915\u094b \u091f\u094d\u0930\u0948\u0915 \u0915\u0930\u0947\u0902",
    myDirTitle: "\u092e\u0947\u0930\u0940 \u0928\u093f\u0930\u094d\u0926\u0947\u0936\u093f\u0915\u093e",
    myDirDesc: "\u0905\u092a\u0928\u0940 \u0915\u092e\u094d\u092f\u0941\u0928\u093f\u091f\u0940 \u0932\u093f\u0938\u094d\u091f\u093f\u0902\u0917 \u092a\u094d\u0930\u092c\u0902\u0927\u093f\u0924 \u0915\u0930\u0947\u0902",
    myUpcomingTitle: "\u0906\u0917\u093e\u092e\u0940",
    myUpcomingDesc: "\u0905\u092a\u0928\u0947 \u0938\u0947 \u091c\u0941\u0921\u093c\u0947 \u0907\u0935\u0947\u0902\u091f\u094d\u0938 \u0926\u0947\u0916\u0947\u0902",
    myEmptyText: "\u091c\u0948\u0938\u0947-\u091c\u0948\u0938\u0947 \u0906\u092a \u092a\u094d\u0932\u0947\u091f\u092b\u0949\u0930\u094d\u092e \u0915\u093e \u0909\u092a\u092f\u094b\u0917 \u0915\u0930\u0947\u0902\u0917\u0947, \u0906\u092a\u0915\u0940 \u0917\u0924\u093f\u0935\u093f\u0927\u093f \u092f\u0939\u093e\u0901 \u0926\u093f\u0916\u093e\u0908 \u0926\u0947\u0917\u0940\u0964",
    signIn: "\u0938\u093e\u0907\u0928 \u0907\u0928 \u0915\u0930\u0947\u0902",
    whatsHappening: "\u0915\u094d\u092f\u093e \u0939\u094b \u0930\u0939\u093e \u0939\u0948",
    communityUpdates: "\u0938\u093e\u092e\u0941\u0926\u093e\u092f\u093f\u0915 \u0905\u092a\u0921\u0947\u091f\u094d\u0938",
    viewDetails: "\u0935\u093f\u0935\u0930\u0923 \u0926\u0947\u0916\u0947\u0902",
    readMore: "\u0914\u0930 \u092a\u0922\u093c\u0947\u0902",
    viewAllUpdates: "\u0938\u092d\u0940 \u0905\u092a\u0921\u0947\u091f\u094d\u0938 \u0926\u0947\u0916\u0947\u0902",
    upcomingEvents: "\u0906\u0917\u093e\u092e\u0940 \u0907\u0935\u0947\u0902\u091f\u094d\u0938",
    viewEvent: "\u0907\u0935\u0947\u0902\u091f \u0926\u0947\u0916\u0947\u0902",
    communityPulse: "\u0915\u092e\u094d\u092f\u0941\u0928\u093f\u091f\u0940 \u092a\u0932\u094d\u0938",
    pulseUpcomingEvents: "\u0906\u0917\u093e\u092e\u0940 \u0907\u0935\u0947\u0902\u091f\u094d\u0938",
    pulseDirListings: "\u0921\u093e\u092f\u0930\u0947\u0915\u094d\u091f\u0930\u0940 \u0932\u093f\u0938\u094d\u091f\u093f\u0902\u0917",
    pulseServices: "\u0938\u0947\u0935\u093e\u090f\u0902",
    pulseUpdates: "\u0905\u092a\u0921\u0947\u091f\u094d\u0938",
    footerTagline: "\u090f\u0915 \u0938\u092e\u0941\u0926\u093e\u092f\u0964 \u0906\u092a\u0915\u0940 \u0939\u0930 \u091c\u0930\u0942\u0930\u0924\u0964",
    navHome: "\u0939\u094b\u092e",
    navServices: "\u0938\u0947\u0935\u093e\u090f\u0902",
    navDirectory: "\u0928\u093f\u0930\u094d\u0926\u0947\u0936\u093f\u0915\u093e",
    navMarketplace: "\u092e\u093e\u0930\u094d\u0915\u0947\u091f\u092a\u094d\u0932\u0947\u0938",
    navEvents: "\u0907\u0935\u0947\u0902\u091f\u094d\u0938"
  }
};

const homepageUpdates = [
  {
    id: "nasr-cup",
    label: { en: "IMPORTANT", gu: "\u0aae\u0ab9\u0aa4\u0acd\u0ab5\u0aaa\u0ac2\u0ab0\u0acd\u0aa3", hi: "\u092e\u0939\u0924\u094d\u0935\u092a\u0942\u0930\u094d\u0923" },
    title: {
      en: "Register for the Nasr Cup",
      gu: "\u0aa8\u0ab8\u0ab0 \u0a95\u0aaa \u0aae\u0abe\u0a9f\u0ac7 \u0aa8\u0acb\u0a82\u0aa7\u0aa3\u0ac0 \u0a95\u0ab0\u0acb",
      hi: "\u0928\u0938\u094d\u0930 \u0915\u092a \u0915\u0947 \u0932\u093f\u090f \u092a\u0902\u091c\u0940\u0915\u0930\u0923 \u0915\u0930\u0947\u0902"
    },
    desc: {
      en: "Registration is now open for the upcoming Nasr Football Cup. Form your teams and register before the deadline.",
      gu: "\u0a86\u0a97\u0abe\u0aae\u0ac0 \u0aa8\u0ab8\u0ab0 \u0aab\u0ac2\u0a9f\u0aac\u0acb\u0ab2 \u0a95\u0aaa \u0aae\u0abe\u0a9f\u0ac7 \u0aa8\u0acb\u0a82\u0aa7\u0aa3\u0ac0 \u0ab9\u0ab5\u0ac7 \u0a96\u0ac1\u0ab2\u0acd\u0ab2\u0ac0 \u0a9b\u0ac7. \u0aa4\u0aae\u0abe\u0ab0\u0ac0 \u0a9f\u0ac0\u0aae\u0acb \u0aac\u0aa8\u0abe\u0ab5\u0acb \u0a85\u0aa8\u0ac7 \u0a85\u0a82\u0aa4\u0abf\u0aae \u0aa4\u0abe\u0ab0\u0ac0\u0a96 \u0aaa\u0ab9\u0ac7\u0ab2\u0abe\u0a82 \u0aa8\u0acb\u0a82\u0aa7\u0aa3\u0ac0 \u0a95\u0ab0\u0acb.",
      hi: "\u0906\u0917\u093e\u092e\u0940 \u0928\u0938\u094d\u0930 \u092b\u0941\u091f\u092c\u0949\u0932 \u0915\u092a \u0915\u0947 \u0932\u093f\u090f \u092a\u0902\u091c\u0940\u0915\u0930\u0923 \u0905\u092c \u0916\u0941\u0932\u093e \u0939\u0948\u0964 \u0905\u092a\u0928\u0940 \u091f\u0940\u092e \u092c\u0928\u093e\u090f\u0902 \u0914\u0930 \u0938\u092e\u092f \u0938\u0940\u092e\u093e \u0938\u0947 \u092a\u0939\u0932\u0947 \u092a\u0902\u091c\u0940\u0915\u0930\u0923 \u0915\u0930\u0947\u0902\u0964"
    },
    href: "/updates/nasr-cup"
  },
  {
    id: "hackathon",
    author: { en: "Tech and AI Committee", gu: "\u0a9f\u0ac7\u0a95 \u0a8f\u0aa8\u0acd\u0aa1 AI \u0a95\u0aae\u0abf\u0a9f\u0ac0", hi: "\u091f\u0947\u0915 \u0914\u0930 \u090f\u0906\u0908 \u0915\u092e\u0947\u091f\u0940" },
    time: { en: "Technology \u2022 Today", gu: "\u0a9f\u0ac7\u0a95\u0acd\u0aa8\u0acb\u0ab2\u0acb\u0a9c\u0ac0 \u2022 \u0a86\u0a9c\u0ac7", hi: "\u091f\u0947\u0915\u094d\u0928\u094b\u0932\u0949\u091c\u0940 \u2022 \u0906\u091c" },
    title: {
      en: "KSIJ Hackathon - Build for the Community",
      gu: "KSIJ \u0ab9\u0ac7\u0a95\u0abe\u0aa5\u0acb\u0aa8 - \u0ab8\u0aae\u0ac1\u0aa6\u0abe\u0aaf \u0aae\u0abe\u0a9f\u0ac7 \u0aac\u0aa8\u0abe\u0ab5\u0acb",
      hi: "KSIJ \u0939\u0948\u0915\u093e\u0925\u0949\u0928 - \u0938\u092e\u0941\u0926\u093e\u092f \u0915\u0947 \u0932\u093f\u090f \u092c\u0928\u093e\u090f\u0902"
    },
    desc: {
      en: "Join the complete KSIJ Hackathon today! Build innovative solutions that directly solve problems for our community and win exciting prizes.",
      gu: "\u0a86\u0a9c\u0ac7 \u0a9c \u0ab8\u0a82\u0aaa\u0ac2\u0ab0\u0acd\u0aa3 KSIJ \u0ab9\u0ac7\u0a95\u0abe\u0aa5\u0acb\u0aa8\u0aae\u0abe\u0a82 \u0a9c\u0acb\u0aa1\u0abe\u0a93! \u0a8f\u0ab5\u0abe \u0a89\u0a95\u0ac7\u0ab2\u0acb \u0aac\u0aa8\u0abe\u0ab5\u0acb \u0a9c\u0ac7 \u0a86\u0aaa\u0aa3\u0abe \u0ab8\u0aae\u0ac1\u0aa6\u0abe\u0aaf\u0aa8\u0ac0 \u0ab8\u0aae\u0ab8\u0acd\u0aaf\u0abe\u0a93\u0aa8\u0acb \u0ab8\u0ac0\u0aa7\u0acb \u0a89\u0a95\u0ac7\u0ab2 \u0ab2\u0abe\u0ab5\u0ac7 \u0a85\u0aa8\u0ac7 \u0ab0\u0acb\u0aae\u0abe\u0a82\u0a9a\u0a95 \u0a87\u0aa8\u0abe\u0aae\u0acb \u0a9c\u0ac0\u0aa4\u0acb.",
      hi: "\u0906\u091c \u0939\u0940 KSIJ \u0939\u0948\u0915\u093e\u0925\u0949\u0928 \u092e\u0947\u0902 \u0936\u093e\u092e\u093f\u0932 \u0939\u094b\u0902! \u0910\u0938\u0947 \u0938\u092e\u093e\u0927\u093e\u0928 \u092c\u0928\u093e\u090f\u0902 \u091c\u094b \u0938\u0940\u0927\u0947 \u0939\u092e\u093e\u0930\u0947 \u0938\u092e\u0941\u0926\u093e\u092f \u0915\u0940 \u0938\u092e\u0938\u094d\u092f\u093e\u0913\u0902 \u0915\u094b \u0939\u0932 \u0915\u0930\u0947\u0902 \u0914\u0930 \u0930\u094b\u092e\u093e\u0902\u091a\u0915 \u092a\u0941\u0930\u0938\u094d\u0915\u093e\u0930 \u091c\u0940\u0924\u0947\u0902\u0964"
    },
    href: "/updates/hackathon"
  },
  {
    id: "ai-bootcamp",
    author: { en: "Education Board", gu: "\u0ab6\u0abf\u0a95\u0acd\u0ab7\u0aa3 \u0aac\u0acb\u0ab0\u0acd\u0aa1", hi: "\u0936\u093f\u0915\u094d\u0937\u093e \u092c\u094b\u0930\u094d\u0921" },
    time: { en: "Education \u2022 Yesterday", gu: "\u0ab6\u0abf\u0a95\u0acd\u0ab7\u0aa3 \u2022 \u0a97\u0a88\u0a95\u0abe\u0ab2\u0ac7", hi: "\u0936\u093f\u0915\u094d\u0937\u093e \u2022 \u0915\u0932" },
    title: {
      en: "2-Day AI Bootcamp",
      gu: "2-\u0aa6\u0abf\u0ab5\u0ab8\u0ac0\u0aaf \u0a8f\u0a86\u0a88 \u0aac\u0ac1\u0a9f\u0a95\u0ac7\u0aae\u0acd\u0aaa",
      hi: "2-\u0926\u093f\u0935\u0938\u0940\u092f \u090f\u0906\u0908 \u092c\u0942\u091f\u0915\u0948\u0902\u092a"
    },
    desc: {
      en: "In this 2-day AI bootcamp by Ali Mehdi (Hemani Digitalist Institute), Day 1 covers Generative AI and Day 2 focuses on Agentic AI.",
      gu: "\u0a85\u0ab2\u0ac0 \u0aae\u0ac7\u0ab9\u0aa6\u0ac0 (\u0ab9\u0ac7\u0aae\u0abe\u0aa8\u0ac0 \u0aa1\u0abf\u0a9c\u0abf\u0a9f\u0abe\u0ab2\u0abf\u0ab8\u0acd\u0a9f \u0a87\u0aa8\u0acd\u0ab8\u0acd\u0a9f\u0abf\u0a9f\u0acd\u0aaf\u0ac2\u0a9f) \u0aa8\u0abe \u0a86 2-\u0aa6\u0abf\u0ab5\u0ab8\u0ac0\u0aaf AI \u0aac\u0ac1\u0a9f\u0a95\u0ac7\u0aae\u0acd\u0aaa\u0aae\u0abe\u0a82, \u0aa6\u0abf\u0ab5\u0ab8 1 \u0a9c\u0aa8\u0ab0\u0ac7\u0a9f\u0abf\u0ab5 AI \u0a86\u0ab5\u0ab0\u0ac0 \u0ab2\u0ac7 \u0a9b\u0ac7 \u0a85\u0aa8\u0ac7 \u0aa6\u0abf\u0ab5\u0ab8 2 \u0a8f\u0a9c\u0aa8\u0acd\u0a9f\u0abf\u0a95 AI \u0aaa\u0ab0 \u0aa7\u0acd\u0aaf\u0abe\u0aa8 \u0a95\u0ac7\u0aa8\u0acd\u0aa6\u0acd\u0ab0\u0abf\u0aa4 \u0a95\u0ab0\u0ac7 \u0a9b\u0ac7.",
      hi: "\u0905\u0932\u0940 \u092e\u0947\u0939\u0926\u0940 (\u0939\u0947\u092e\u093e\u0928\u0940 \u0921\u093f\u091c\u093f\u091f\u0932\u093f\u0938\u094d\u091f \u0907\u0902\u0938\u094d\u091f\u0940\u091f\u094d\u092f\u0942\u091f) \u0915\u0947 \u0907\u0938 2-\u0926\u093f\u0935\u0938\u0940\u092f \u090f\u0906\u0908 \u092c\u0942\u091f\u0915\u0948\u0902\u092a \u092e\u0947\u0902, \u0926\u093f\u0928 1 \u091c\u0928\u0930\u0947\u091f\u093f\u0935 \u090f\u0906\u0908 \u0915\u094b \u0915\u0935\u0930 \u0915\u0930\u0924\u093e \u0939\u0948 \u0914\u0930 \u0926\u093f\u0928 2 \u090f\u091c\u0947\u0902\u091f\u093f\u0915 \u090f\u0906\u0908 \u092a\u0930 \u0915\u0947\u0902\u0926\u094d\u0930\u093f\u0924 \u0939\u0948\u0964"
    },
    href: "/updates/ai-bootcamp"
  },
  {
    id: "medical-camp",
    author: { en: "Health & Welfare Board", gu: "\u0ab8\u0acd\u0ab5\u0abe\u0ab8\u0acd\u0aa5\u0acd\u0aaf \u0a85\u0aa8\u0ac7 \u0a95\u0ab2\u0acd\u0aaf\u0abe\u0aa3 \u0aac\u0acb\u0ab0\u0acd\u0aa1", hi: "\u0938\u094d\u0935\u093e\u0938\u094d\u0925\u094d\u092f \u090f\u0935\u0902 \u0915\u0932\u094d\u092f\u093e\u0923 \u092c\u094b\u0930\u094d\u0921" },
    time: { en: "Health \u2022 Oct 1", gu: "\u0ab8\u0acd\u0ab5\u0abe\u0ab8\u0acd\u0aa5\u0acd\u0aaf \u2022 \u0a93\u0a95\u0acd\u0a9f\u0acb\u0aac\u0ab0 1", hi: "\u0938\u094d\u0935\u093e\u0938\u094d\u0925\u094d\u092f \u2022 1 \u0905\u0915\u094d\u091f\u0942\u092c\u0930" },
    title: {
      en: "Annual Free Medical Camp",
      gu: "\u0ab5\u0abe\u0ab0\u0acd\u0ab7\u0abf\u0a95 \u0aae\u0aab\u0aa4 \u0aae\u0ac7\u0aa1\u0abf\u0a95\u0ab2 \u0a95\u0ac7\u0aae\u0acd\u0aaa",
      hi: "\u0935\u093e\u0930\u094d\u0937\u093f\u0915 \u0928\u093f\u0903\u0936\u0941\u0932\u094d\u0915 \u091a\u093f\u0915\u093f\u0924\u094d\u0938\u093e \u0936\u093f\u0935\u093f\u0930"
    },
    desc: {
      en: "Free consultations, dental checks, and eye exams for all community members this weekend at the main medical center.",
      gu: "\u0a86 \u0ab8\u0aaa\u0acd\u0aa4\u0abe\u0ab9\u0aa8\u0abe \u0a85\u0a82\u0aa4\u0ac7 \u0aae\u0ac1\u0a96\u0acd\u0aaf \u0aa4\u0aac\u0ac0\u0aac\u0ac0 \u0a95\u0ac7\u0aa8\u0acd\u0aa6\u0acd\u0ab0 \u0a96\u0abe\u0aa4\u0ac7 \u0ab8\u0aae\u0ac1\u0aa6\u0abe\u0aaf\u0aa8\u0abe \u0aa4\u0aae\u0abe\u0aae \u0ab8\u0aad\u0acd\u0aaf\u0acb \u0aae\u0abe\u0a9f\u0ac7 \u0aae\u0aab\u0aa4 \u0aaa\u0ab0\u0abe\u0aae\u0ab0\u0acd\u0ab6, \u0aa6\u0abe\u0a82\u0aa4\u0aa8\u0ac0 \u0aa4\u0aaa\u0abe\u0ab8 \u0a85\u0aa8\u0ac7 \u0a86\u0a82\u0a96\u0aa8\u0ac0 \u0aa4\u0aaa\u0abe\u0ab8.",
      hi: "\u0907\u0938 \u0938\u092a\u094d\u0924\u093e\u0939\u093e\u0902\u0924 \u092e\u0941\u0916\u094d\u092f \u091a\u093f\u0915\u093f\u0924\u094d\u0938\u093e \u0915\u0947\u0902\u0926\u094d\u0930 \u092e\u0947\u0902 \u0938\u092e\u0941\u0926\u093e\u092f \u0915\u0947 \u0938\u092d\u0940 \u0938\u0926\u0938\u094d\u092f\u094b\u0902 \u0915\u0947 \u0932\u093f\u090f \u092e\u0941\u092b\u094d\u0924 \u092a\u0930\u093e\u092e\u0930\u094d\u0936, \u0926\u0902\u0924 \u091a\u093f\u0915\u093f\u0924\u094d\u0938\u093e \u091c\u093e\u0902\u091a \u0914\u0930 \u0906\u0902\u0916\u094b\u0902 \u0915\u0940 \u091c\u093e\u0902\u091a\u0964"
    },
    href: "/updates/medical-camp"
  }
];

const upcomingEventsData = [
  {
    id: "hackathon",
    month: { en: "OCT", gu: "\u0a93\u0a95\u0a9f\u0acb", hi: "\u0905\u0915\u094d\u091f\u0942" },
    day: "04",
    title: { en: "KSIJ Hackathon", gu: "KSIJ Hackathon", hi: "KSIJ Hackathon" },
    info: { en: "Khoja Masjid Imambada Hall Dongri<br/>9:00 AM", gu: "\u0a96\u0acb\u0a9c\u0abe \u0aae\u0ab8\u0acd\u0a9c\u0abf\u0aa6 \u0a87\u0aae\u0abe\u0aae\u0ab5\u0abe\u0aa1\u0abe \u0ab9\u0acb\u0ab2 \u0aa1\u0acb\u0a82\u0a97\u0ab0\u0ac0<br/>\u0ab8\u0ab5\u0abe\u0ab0\u0ac7 9:00", hi: "\u0916\u094b\u091c\u093e \u092e\u0938\u094d\u091c\u093f\u0926 \u0907\u092e\u093e\u092e\u092c\u093e\u0921\u093c\u093e \u0939\u0949\u0932 \u0921\u094b\u0902\u0917\u0930\u0940<br/>\u0938\u0941\u092c\u0939 9:00 \u092c\u091c\u0947" },
    href: "/events/hackathon"
  },
  {
    id: "nasr-cup",
    month: { en: "OCT", gu: "\u0a93\u0a95\u0a9f\u0acb", hi: "\u0905\u0915\u094d\u091f\u0942" },
    day: "11",
    title: { en: "NASR Football Cup", gu: "NASR Football Cup", hi: "NASR Football Cup" },
    info: { en: "Registration open until Oct 4th.<br/>4:00 PM", gu: "\u0aa8\u0acb\u0a82\u0aa7\u0aa3\u0ac0 4 \u0aa5\u0ac0 \u0a93\u0a95\u0acd\u0a9f\u0acb\u0aac\u0ab0 \u0ab8\u0ac1\u0aa7\u0ac0 \u0a96\u0ac1\u0ab2\u0acd\u0ab2\u0ac0 \u0a9b\u0ac7.<br/>\u0ab8\u0abe\u0a82\u0a9c\u0ac7 4:00", hi: "\u092a\u0902\u091c\u0940\u0915\u0930\u0923 4 \u0905\u0915\u094d\u091f\u0942\u092c\u0930 \u0924\u0915 \u0916\u0941\u0932\u093e \u0939\u0948\u3002<br/>\u0936\u093e\u092e 4:00 \u092c\u091c\u0947" },
    href: "/events/nasr-cup"
  }
];

const activityStripData = [
  {
    title: { en: "KSIJ Hackathon", gu: "KSIJ \u0ab9\u0ac7\u0a95\u0abe\u0aa5\u0acb\u0aa8", hi: "KSIJ \u0939\u0948\u0915\u093e\u0925\u0949\u0928" },
    time: { en: "Technology \u2022 Oct 04", gu: "\u0a9f\u0ac7\u0a95\u0acd\u0aa8\u0acb\u0ab2\u0acb\u0a9c\u0ac0 \u2022 \u0a93\u0a95\u0acd\u0a9f\u0acb 04", hi: "\u091f\u0947\u0915\u094d\u0928\u094b\u0932\u0949\u091c\u0940 \u2022 04 \u0905\u0915\u094d\u091f\u0942" },
    href: "/events/hackathon",
    icon: "Monitor"
  },
  {
    title: { en: "NASR Football Cup", gu: "NASR \u0aab\u0ac2\u0a9f\u0aac\u0acb\u0ab2 \u0a95\u0aaa", hi: "NASR \u092b\u0941\u091f\u092c\u0949\u0932 \u0915\u092a" },
    time: { en: "Sports \u2022 Oct 11", gu: "\u0ab0\u0aae\u0aa4\u0a97\u0aae\u0aa4 \u2022 \u0a93\u0a95\u0acd\u0a9f\u0acb 11", hi: "\u0916\u0947\u0932 \u2022 11 \u0905\u0915\u094d\u091f\u0942" },
    href: "/events/nasr-cup",
    icon: "Activity"
  },
  {
    title: { en: "2-Day AI Bootcamp", gu: "2-\u0aa6\u0abf\u0ab5\u0ab8\u0ac0\u0aaf \u0a8f\u0a86\u0a88 \u0aac\u0ac1\u0a9f\u0a95\u0ac7\u0aae\u0acd\u0aaa", hi: "2-\u0926\u093f\u0935\u0938\u0940\u092f \u090f\u0906\u0908 \u092c\u0942\u091f\u0915\u0948\u0902\u092a" },
    time: { en: "Education \u2022 Yesterday", gu: "\u0ab6\u0abf\u0a95\u0acd\u0ab7\u0aa3 \u2022 \u0a97\u0a88\u0a95\u0abe\u0ab2\u0ac7", hi: "\u0936\u093f\u0915\u094d\u0937\u093e \u2022 \u0915\u0932" },
    href: "/updates/ai-bootcamp",
    icon: "BookOpen"
  },
  {
    title: { en: "Medical Camp", gu: "\u0aae\u0ac7\u0aa1\u0abf\u0a95\u0ab2 \u0a95\u0ac7\u0aae\u0acd\u0aaa", hi: "\u091a\u093f\u0915\u093f\u0924\u094d\u0938\u093e \u0936\u093f\u0935\u093f\u0930" },
    time: { en: "Health \u2022 Oct 1", gu: "\u0ab8\u0acd\u0ab5\u0abe\u0ab8\u0acd\u0aa5\u0acd\u0aaf \u2022 \u0a93\u0a95\u0acd\u0a9f\u0acb 1", hi: "\u0938\u094d\u0935\u093e\u0938\u094d\u0925\u094d\u092f \u2022 1 \u0905\u0915\u094d\u091f\u0942" },
    href: "/updates/medical-camp",
    icon: "Heart"
  }
];

export default function HomePage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<{ directory: any[], marketplace: any[], services: any[] }>({ directory: [], marketplace: [], services: [] });
  const [showIntro, setShowIntro] = useState(true);
  const [skipAnimation, setSkipAnimation] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    const savedLang = localStorage.getItem('ksij-home-language') as Language;
    if (savedLang === 'gu' || savedLang === 'hi') {
      setLanguage(savedLang);
    }
  }, []);

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('ksij-home-language', lang);
  };

  const t = (key: string) => translations[language]?.[key] || translations['en'][key];

  const yHero = useTransform(scrollY, [0, 500], [0, 100]);
  const opacityHero = useTransform(scrollY, [0, 300], [1, 0]);

  // Subtle logo parallax for desktop
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const userName = session?.user?.name ? session.user.name.split(' ')[0] : "";
  const isAuthenticated = !!session?.user;

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchFocused(false);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    // Only apply very small movement (max 8px)
    const x = (e.clientX / window.innerWidth - 0.5) * 16;
    const y = (e.clientY / window.innerHeight - 0.5) * 16;
    setMousePos({ x, y });
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const hasSeenIntro = localStorage.getItem("ksijOneIntroSeen");
    if (hasSeenIntro) {
      setSkipAnimation(true);
      setShowIntro(false);
    } else {
      const timer = setTimeout(() => {
        setShowIntro(false);
        localStorage.setItem("ksijOneIntroSeen", "true");
      }, 3000); // 3 seconds
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    const fetchResults = async () => {
      if (!searchQuery.trim()) {
        setSearchResults({ directory: [], marketplace: [], services: [] });
        return;
      }
      setIsSearching(true);
      try {
        const results = await globalSearch(searchQuery);
        setSearchResults(results);
      } catch (error) {
        console.error("Search failed:", error);
      } finally {
        setIsSearching(false);
      }
    };

    const timer = setTimeout(() => {
      fetchResults();
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  return (
    <div className={styles.pageWrapper}>

      {!skipAnimation && (
        <AnimatePresence>
          {showIntro && (
            <motion.div
              key="introOverlay"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
              className={styles.introOverlay}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className={styles.introBrand}
              >
                KSIJ ONE
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* HEADER / HERO SECTION */}
      <section className={styles.heroSection} onMouseMove={handleMouseMove}>
        <motion.div style={{ y: yHero, opacity: opacityHero }} className={styles.heroContainer}>

          {/* LEFT: Text & Search */}
          <div className={styles.heroContent}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.8 }}>
              <div className={styles.languageSwitcher} style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '24px', fontSize: '0.875rem', fontWeight: 500 }}>
                <button onClick={() => handleLanguageChange('en')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: language === 'en' ? 'var(--color-primary-dark)' : 'var(--color-text-secondary)', textDecoration: language === 'en' ? 'underline' : 'none', textUnderlineOffset: '4px', padding: 0 }}>EN</button>
                <span style={{ color: 'var(--color-border)' }}>|</span>
                <button onClick={() => handleLanguageChange('gu')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: language === 'gu' ? 'var(--color-primary-dark)' : 'var(--color-text-secondary)', textDecoration: language === 'gu' ? 'underline' : 'none', textUnderlineOffset: '4px', padding: 0 }}>ગુજરાતી</button>
                <span style={{ color: 'var(--color-border)' }}>|</span>
                <button onClick={() => handleLanguageChange('hi')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: language === 'hi' ? 'var(--color-primary-dark)' : 'var(--color-text-secondary)', textDecoration: language === 'hi' ? 'underline' : 'none', textUnderlineOffset: '4px', padding: 0 }}>हिन्दी</button>
              </div>
              <div className={styles.heroEyebrow}>{t('heroEyebrow')}</div>
              <h1 className={styles.heroGreeting}>{t("heroGreeting")}{userName ? `, ${userName}` : ""}</h1>
              <p className={styles.heroSubtitle} dangerouslySetInnerHTML={{ __html: t("heroSubtitle") }}></p>
            </motion.div>

            {/* ACTUAL MODAL SEARCH OVERLAY */}
            <AnimatePresence>
              {isSearchFocused && (
                <motion.div
                  className={styles.searchOverlay}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className={styles.searchBackdrop} onClick={() => setIsSearchFocused(false)} />

                  <motion.div
                    className={styles.searchModal}
                    initial={{ scale: 0.95, opacity: 0, y: -20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: -20 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                  >
                    <div className={styles.searchModalHeader}>
                      <Search className={styles.searchModalIcon} size={28} color="#075C3A" />
                      <input
                        ref={(input) => { if (input) input.focus(); }}
                        type="text"
                        placeholder={t("searchPlaceholder")}
                        className={styles.searchModalInput}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={handleSearch}
                      />
                      <button className={styles.searchModalClose} onClick={() => setIsSearchFocused(false)}>
                        Esc
                      </button>
                    </div>

                    {searchQuery.length > 0 && (
                      <div className={styles.searchModalResults}>
                        {isSearching ? (
                          <div className="flex-center py-48 text-secondary">
                            <Loader2 size={32} className="animate-spin" />
                            <span className="ml-16 text-lg">{t("searchLoading")}</span>
                          </div>
                        ) : (
                          <div className={styles.searchModalGrid}>
                            {searchResults.services && searchResults.services.length > 0 && (
                              <div className={styles.modalResultCategory}>
                                <div className={styles.modalCategoryTitle}>{t("searchCommunityServices")}</div>
                                {searchResults.services.map((item) => (
                                  <Link key={item.id} href={`/services/${item.id}`} className={styles.modalResultItem}>
                                    <div className={styles.modalItemContent}>
                                      <span className={styles.modalItemTitle}>{item.title}</span>
                                      <span className={styles.modalItemDesc}>{item.description?.substring(0, 60)}...</span>
                                    </div>
                                    <ChevronRight className={styles.modalItemArrow} size={20} />
                                  </Link>
                                ))}
                              </div>
                            )}

                            {searchResults.directory.length > 0 && (
                              <div className={styles.modalResultCategory}>
                                <div className={styles.modalCategoryTitle}>{t("searchPeoplePro")}</div>
                                {searchResults.directory.map((item) => (
                                  <Link key={item.id} href={`/directory/${item.id}`} className={styles.modalResultItem}>
                                    <div className={styles.modalItemContent}>
                                      <span className={styles.modalItemTitle}>{item.name}</span>
                                      <span className={styles.modalItemDesc}>{item.category}</span>
                                    </div>
                                    <ChevronRight className={styles.modalItemArrow} size={20} />
                                  </Link>
                                ))}
                              </div>
                            )}

                            {searchResults.marketplace.length > 0 && (
                              <div className={styles.modalResultCategory}>
                                <div className={styles.modalCategoryTitle}>{t("searchMarketplace")}</div>
                                {searchResults.marketplace.map((item) => (
                                  <Link key={item.id} href={`/marketplace/${item.transactionType.toLowerCase() === 'sell' ? 'member-marketplace' : 'community-properties'}/${item.id}`} className={styles.modalResultItem}>
                                    <div className={styles.modalItemContent}>
                                      <span className={styles.modalItemTitle}>{item.title}</span>
                                      <span className={styles.modalItemDesc}>{item.category}</span>
                                    </div>
                                    <ChevronRight className={styles.modalItemArrow} size={20} />
                                  </Link>
                                ))}
                              </div>
                            )}

                            {searchResults.directory.length === 0 && searchResults.marketplace.length === 0 && (!searchResults.services || searchResults.services.length === 0) && (
                              <div className="flex-center py-48 text-secondary">
                                <span className="text-lg">{t("searchNoResults")} &quot;{searchQuery}&quot;</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* DUMMY HERO SEARCH TRIGGER */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8 }}
              className={styles.searchBlock}
            >
              <div className={styles.searchLabel}>{t("searchLabel")}</div>
              <div
                className={styles.searchWrapper}
                onClick={() => setIsSearchFocused(true)}
                style={{ cursor: 'text' }}
              >
                <div className={styles.searchContainer}>
                  <Search className={styles.searchIcon} size={24} color="#075C3A" />
                  <div className={styles.searchInputPlaceholder}>
                    {t("searchPlaceholder")}
                  </div>
                  <Mic className={styles.micIcon} size={24} color="#9CA3AF" />
                  <div className={styles.searchSubmitBtn}>
                    <ArrowRight size={20} />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* RIGHT: REAL KSIJ LOGO */}
          <div className={styles.heroVisual}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{
                opacity: 1,
                scale: 1,
                x: mousePos.x,
                y: mousePos.y
              }}
              transition={{
                opacity: { duration: 1.2, delay: 0.2 },
                scale: { duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] },
                x: { type: "spring", stiffness: 50, damping: 20 },
                y: { type: "spring", stiffness: 50, damping: 20 }
              }}
              className={styles.logoWrapper}
            >
              <img src="/ksij-logo.jpg" alt="KSIJ Logo" className={styles.heroLogo} onError={(e) => {
                // If logo is missing, fallback to a clean typographic placeholder to avoid broken image
                e.currentTarget.style.display = 'none';
                e.currentTarget.parentElement?.classList.add(styles.logoPlaceholderActive);
              }} />
              <div className={styles.logoPlaceholder}>KSIJ</div>
            </motion.div>
          </div>

        </motion.div>
      </section>

      {/* QUICK ACCESS - BENTO COMPOSITION */}
      <section className={styles.bentoSection}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            className={styles.bentoGrid}
          >
            <Link href="/services" className={styles.bentoCardLarge}>
              <div className={styles.bentoCardContent}>
                <Grid size={32} color="#075C3A" />
                <h2>{t("bentoServicesTitle")}</h2>
                <p>{t("bentoServicesDesc")}</p>
                <div className={styles.bentoArrow}><ArrowRight size={24} /></div>
              </div>
              <div className={styles.bentoCardPattern}></div>
            </Link>

            <Link href="/directory" className={styles.bentoCardMedium}>
              <div className={styles.bentoCardContent}>
                <Users size={28} color="#C8A64B" />
                <h3>{t("bentoDirectoryTitle")}</h3>
                <p>{t("bentoDirectoryDesc")}</p>
                <div className={styles.bentoArrow}><ArrowRight size={20} /></div>
              </div>
            </Link>

            <Link href="/events" className={styles.bentoCardMediumWhite}>
              <div className={styles.bentoCardContent}>
                <Calendar size={28} color="#075C3A" />
                <h3>{t("bentoEventsTitle")}</h3>
                <p>{t("bentoEventsDesc")}</p>
                <div className={styles.bentoArrow}><ArrowRight size={20} /></div>
              </div>
            </Link>

            <Link href="/marketplace" className={styles.bentoCardSmallDark}>
              <div className={styles.bentoCardContent}>
                <Store size={24} color="#FFFFFF" />
                <h3>{t("bentoMarketplaceTitle")}</h3>
                <div className={styles.bentoArrow}><ArrowRight size={20} /></div>
              </div>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* YOUR KSIJ ONE (PERSONALIZED) */}
      <section className={styles.personalizedSection}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="h3 mb-24" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-primary-dark)' }}>{t("myKsijTitle")}</h2>

            {isAuthenticated ? (
              <div className={styles.personalizedGrid}>
                <Link href="/profile" className={styles.personalCard}>
                  <div className={styles.personalIcon}><FileText size={20} /></div>
                  <div className={styles.personalContent}>
                    <h4>{t("myAppsTitle")}</h4>
                    <p>{t("myAppsDesc")}</p>
                  </div>
                  <ChevronRight size={16} className={styles.personalArrow} />
                </Link>
                <Link href="/profile" className={styles.personalCard}>
                  <div className={styles.personalIcon}><Users size={20} /></div>
                  <div className={styles.personalContent}>
                    <h4>{t("myDirTitle")}</h4>
                    <p>{t("myDirDesc")}</p>
                  </div>
                  <ChevronRight size={16} className={styles.personalArrow} />
                </Link>
                <Link href="/profile" className={styles.personalCard}>
                  <div className={styles.personalIcon}><Calendar size={20} /></div>
                  <div className={styles.personalContent}>
                    <h4>{t("myUpcomingTitle")}</h4>
                    <p>{t("myUpcomingDesc")}</p>
                  </div>
                  <ChevronRight size={16} className={styles.personalArrow} />
                </Link>
              </div>
            ) : (
              <div className={styles.personalEmptyState}>
                <div className={styles.personalEmptyIcon}><ClipboardList size={32} /></div>
                <p>{t("myEmptyText")}</p>
                <Link href="/login" className="btn btn-secondary mt-16">{t("signIn")}</Link>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* WHAT'S HAPPENING (NEW ACTIVITY STRIP) */}
      <section className="section-padding bg-background">
        <div className="container">
          <h2 className="h2 mb-24" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-primary-dark)', fontSize: '1.25rem', letterSpacing: '0.05em', fontWeight: 700, textTransform: 'uppercase' }}>{t("whatsHappening")}</h2>
          <div className={styles.activityStrip}>
            {activityStripData.map((act, idx) => {
              const Icon = act.icon === 'Monitor' ? Monitor : act.icon === 'Activity' ? Activity : act.icon === 'BookOpen' ? BookOpen : Heart;
              return (
                <Link href={act.href} className={styles.activityCard} key={idx}>
                  <div className={styles.activityIcon}><Icon size={20} /></div>
                  <div className={styles.activityContent}>
                    <h4>{act.title[language as keyof typeof act.title]}</h4>
                    <p>{act.time[language as keyof typeof act.time]}</p>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* EDITORIAL UPDATES AND EVENTS */}
      <section className="section-padding bg-white">
        <div className="container">
          <div className={styles.editorialSplit}>

            <div className={styles.editorialLeft}>
              <h2 className="h2 mb-32" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-primary-dark)' }}>{t("communityUpdates")}</h2>

              <div className={styles.updatesList}>
                {homepageUpdates.map((update, idx) => {
                  if (update.label) {
                    return (
                      <Link href={update.href} className={styles.featuredUpdate} key={idx}>
                        <div className={styles.featuredUpdateLabel}>{update.label[language as keyof typeof update.label]}</div>
                        <h3 className={styles.featuredUpdateTitle}>{update.title[language as keyof typeof update.title]}</h3>
                        <p className={styles.featuredUpdateDesc}>{update.desc[language as keyof typeof update.desc]}</p>
                        <div className={styles.editorialLink}>{t("viewDetails")} <ArrowRight size={16} /></div>
                      </Link>
                    )
                  } else {
                    return (
                      <Link href={update.href} className={styles.standardUpdate} key={idx}>
                        <div className={styles.updateSource}>
                          <div className={styles.updateMeta}>
                            <span className={styles.updateAuthor}>{update.author?.[language as keyof typeof update.author] || ''}</span>
                            <span className={styles.updateTime}>{update.time?.[language as keyof typeof update.time] || ''}</span>
                          </div>
                        </div>
                        <h3 className={styles.standardUpdateTitle}>{update.title[language as keyof typeof update.title]}</h3>
                        <p className={styles.standardUpdateDesc}>{update.desc[language as keyof typeof update.desc]}</p>
                        <div className={styles.editorialLink}>{t("readMore")} <ArrowRight size={16} /></div>
                      </Link>
                    )
                  }
                })}
              </div>

              <Link href="/updates" className={styles.viewAllLink}>
                {t("viewAllUpdates")} <ArrowRight size={16} />
              </Link>
            </div>

            <div className={styles.editorialRight}>
              <h2 className="h2 mb-32" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-primary-dark)' }}>{t("upcomingEvents")}</h2>

              <div className={styles.eventsList}>
                {upcomingEventsData.map((ev, idx) => (
                  <Link href={ev.href} className={styles.editorialEvent} key={idx}>
                    <div className={styles.eventDateBlock}>
                      <span className={styles.eventMonth}>{ev.month[language as keyof typeof ev.month]}</span>
                      <span className={styles.eventDay}>{ev.day}</span>
                      <div className={styles.eventGoldLine}></div>
                    </div>
                    <div className={styles.eventDetails}>
                      <h3 className={styles.eventTitle}>{ev.title[language as keyof typeof ev.title]}</h3>
                      <p className={styles.eventInfo} dangerouslySetInnerHTML={{ __html: ev.info[language as keyof typeof ev.info] }}></p>
                      <div className={styles.editorialLink}>{t("viewEvent")} <ArrowRight size={16} /></div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* COMMUNITY PULSE - NOW BELOW UPDATES */}
      <section className={styles.pulseSection}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className={styles.pulseHeader}>{t("communityPulse")}</h2>
            <div className={styles.pulseGrid}>
              <div className={styles.pulseItem}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className={styles.pulseNumber}
                >12</motion.div>
                <div className={styles.pulseLabel}>{t("pulseUpcomingEvents")}</div>
              </div>
              <div className={styles.pulseItem}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className={styles.pulseNumber}
                >34</motion.div>
                <div className={styles.pulseLabel}>{t("pulseDirListings")}</div>
              </div>
              <div className={styles.pulseItem}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className={styles.pulseNumber}
                >6</motion.div>
                <div className={styles.pulseLabel}>{t("pulseServices")}</div>
              </div>
              <div className={styles.pulseItem}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className={styles.pulseNumber}
                >8</motion.div>
                <div className={styles.pulseLabel}>{t("pulseUpdates")}</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FULL-WIDTH DARK GREEN FOOTER */}
      <footer className={styles.footerSection}>
        <div className="container">
          <div className={styles.footerContent}>
            <div className={styles.footerBrand}>KSIJ One</div>
            <div className={styles.footerTagline}>{t("footerTagline")}</div>
            <div className={styles.footerGoldLine}></div>

            <div className={styles.footerLinks}>
              <Link href="/home">{t("navHome")}</Link>
              <Link href="/services">{t("navServices")}</Link>
              <Link href="/directory">{t("navDirectory")}</Link>
              <Link href="/marketplace">{t("navMarketplace")}</Link>
              <Link href="/events">{t("navEvents")}</Link>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
