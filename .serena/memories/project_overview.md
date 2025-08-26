# Project Overview - バイブコーディング掲示板

## Project Purpose
Vibe Coding Bulletin Board (バイブコーディング掲示板) - MVP version
- An anonymous text bulletin board system with real-time updates
- Japanese UI only
- No authentication required
- Real-time updates using Supabase subscriptions
- Permanent posts and comments (no edit/delete functionality)

## Current Project State
This is a **NestJS-only project currently**. Despite the CLAUDE.md documentation mentioning Next.js frontend, the actual codebase only contains:
- NestJS backend framework (basic setup complete)
- No Next.js frontend implementation yet
- No Supabase client integration yet
- No Tailwind CSS setup yet

## Architecture Design
The project is designed to have:
- **Frontend**: Next.js (App Router) - NOT IMPLEMENTED YET
- **Backend**: NestJS - BASIC SETUP COMPLETE
- **Database**: PostgreSQL via Supabase - MCP CONFIGURED
- **Styling**: Tailwind CSS - NOT CONFIGURED YET
- **Hosting**: Vercel (Frontend), TBD (Backend)
- **Real-time**: Supabase Subscriptions

## Key Features (Planned)
1. Anonymous posting and commenting
2. Real-time updates via Supabase subscriptions  
3. Pagination (20 posts per page)
4. Mobile-first responsive design
5. Rate limiting (posts: 3/min/IP, comments: 10/min/IP)
6. Hidden content flag for moderation
7. IP hashing for rate limiting

## Database Design (Planned)
- **posts table**: id, title (1-120 chars), body (1-4000 chars), created_at, is_hidden, ip_hash
- **comments table**: id, post_id, body (1-4000 chars), created_at, is_hidden, ip_hash
- Row Level Security (RLS) policies for anonymous access
- Indexes for performance optimization