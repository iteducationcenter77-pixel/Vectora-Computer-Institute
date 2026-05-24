-- =============================================
-- VECTORA COMPUTER INSTITUTE
-- Supabase Database Schema
-- Run this in the Supabase SQL Editor
-- =============================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- CERTIFICATES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS certificates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_name TEXT NOT NULL,
  course TEXT NOT NULL,
  certificate_code TEXT UNIQUE NOT NULL,
  issue_date DATE NOT NULL,
  pdf_link TEXT,
  status TEXT DEFAULT 'Verified' CHECK (status IN ('Verified', 'Revoked', 'Pending')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Public can search certificates by code
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read certificates" ON certificates FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert certificates" ON certificates FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update certificates" ON certificates FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users can delete certificates" ON certificates FOR DELETE TO authenticated USING (true);

-- =============================================
-- COURSES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS courses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  course_name TEXT NOT NULL,
  duration TEXT,
  fees TEXT,
  description TEXT,
  benefits TEXT[] DEFAULT '{}',
  image TEXT,
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read active courses" ON courses FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage courses" ON courses FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- =============================================
-- GALLERY TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS gallery (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  image_link TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Classes', 'Events', 'Workshops', 'Internship', 'AI Sessions')),
  title TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read gallery" ON gallery FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage gallery" ON gallery FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- =============================================
-- HERO SLIDES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS hero_slides (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  image_link TEXT NOT NULL,
  heading TEXT,
  subheading TEXT,
  button_text TEXT DEFAULT 'Start Learning',
  button_link TEXT DEFAULT 'https://wa.me/918638373298',
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE hero_slides ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read active hero slides" ON hero_slides FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage hero slides" ON hero_slides FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- =============================================
-- ANNOUNCEMENTS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS announcements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  message TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read active announcements" ON announcements FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage announcements" ON announcements FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- =============================================
-- ADMISSIONS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS admissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  course TEXT,
  address TEXT,
  message TEXT,
  status TEXT DEFAULT 'New' CHECK (status IN ('New', 'Contacted', 'Enrolled', 'Rejected')),
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE admissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit admission" ON admissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated users can read admissions" ON admissions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can update admissions" ON admissions FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users can delete admissions" ON admissions FOR DELETE TO authenticated USING (true);

-- =============================================
-- SITE ANALYTICS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS site_analytics (
  id INT PRIMARY KEY DEFAULT 1,
  visitor_count BIGINT DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE site_analytics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read analytics" ON site_analytics FOR SELECT USING (true);
CREATE POLICY "Anyone can update visitor count" ON site_analytics FOR UPDATE USING (true) WITH CHECK (true);

-- Insert initial analytics row
INSERT INTO site_analytics (id, visitor_count) VALUES (1, 0) ON CONFLICT (id) DO NOTHING;

-- =============================================
-- SAMPLE SEED DATA
-- =============================================

-- Sample Courses
INSERT INTO courses (course_name, duration, fees, description, benefits, image, sort_order, is_active) VALUES
('AI & Data Science', '6 Months', '₹15,000', 'Master artificial intelligence, machine learning, and data science with hands-on projects. Learn Python, TensorFlow, and real-world AI applications.', ARRAY['Python Programming', 'Machine Learning', 'Deep Learning', 'Data Visualization', 'Real Projects', 'Industry Certificate'], '', 1, true),
('DCA (Diploma in Computer Application)', '6 Months', '₹5,000', 'Comprehensive diploma covering computer fundamentals, MS Office, internet, and basic programming skills for beginners.', ARRAY['Computer Fundamentals', 'MS Office Suite', 'Internet & Email', 'Basic Programming', 'Typing Skills', 'Certificate'], '', 2, true),
('ADCA (Advanced Diploma in Computer Application)', '12 Months', '₹8,000', 'Advanced diploma with in-depth training in office applications, programming, database management, and web technologies.', ARRAY['Advanced MS Office', 'Programming Languages', 'Database Management', 'Web Design', 'Tally', 'Hardware Basics'], '', 3, true),
('PGDCA (Post Graduate Diploma)', '12 Months', '₹12,000', 'Post graduate level diploma covering advanced programming, database administration, web development, and software engineering.', ARRAY['Advanced Programming', 'DBMS', 'Web Development', 'Software Engineering', 'Project Work', 'PG Certificate'], '', 4, true),
('Tally Prime', '3 Months', '₹4,000', 'Complete accounting with Tally Prime — GST, inventory management, payroll, and financial reporting for business professionals.', ARRAY['Tally Prime', 'GST Accounting', 'Inventory Management', 'Payroll', 'Financial Reports', 'Certificate'], '', 5, true),
('Graphic Design', '4 Months', '₹6,000', 'Learn professional graphic design with Adobe Photoshop, Illustrator, and CorelDRAW. Create logos, posters, and digital artwork.', ARRAY['Adobe Photoshop', 'Adobe Illustrator', 'CorelDRAW', 'Logo Design', 'Print Design', 'Portfolio'], '', 6, true),
('Web Development', '6 Months', '₹10,000', 'Full-stack web development from scratch — HTML, CSS, JavaScript, React, Node.js, and database management.', ARRAY['HTML & CSS', 'JavaScript', 'React.js', 'Node.js', 'Database', 'Live Projects'], '', 7, true),
('Digital Marketing', '3 Months', '₹5,000', 'Learn SEO, social media marketing, Google Ads, email marketing, and analytics to grow businesses online.', ARRAY['SEO', 'Social Media Marketing', 'Google Ads', 'Email Marketing', 'Analytics', 'Certificate'], '', 8, true),
('Cyber Security', '4 Months', '₹8,000', 'Ethical hacking, network security, penetration testing, and cybersecurity fundamentals for aspiring security professionals.', ARRAY['Ethical Hacking', 'Network Security', 'Penetration Testing', 'Security Tools', 'Cyber Laws', 'Certificate'], '', 9, true);

-- Sample Announcements
INSERT INTO announcements (message, is_active) VALUES
('🎉 Admissions Open for 2026 Batch — Enroll Now!', true),
('🚀 New AI & Data Science Course Launched — Limited Seats!', true),
('📢 Free Workshop on Web Development — Register Today!', true),
('💼 Internship Program Starting Soon — Apply Now!', true);

-- Sample Certificates
INSERT INTO certificates (student_name, course, certificate_code, issue_date, pdf_link, status) VALUES
('Rahul Sharma', 'AI & Data Science', 'VTCI-AI-2026-001', '2026-03-15', '', 'Verified'),
('Priya Das', 'Web Development', 'VTCI-WD-2026-002', '2026-04-20', '', 'Verified'),
('Amit Kumar', 'DCA', 'VTCI-DCA-2026-003', '2026-05-10', '', 'Verified');

-- Sample Hero Slides (using placeholder gradient backgrounds)
INSERT INTO hero_slides (heading, subheading, image_link, button_text, button_link, sort_order, is_active) VALUES
('Learn AI Today. Lead Tomorrow.', 'Transform your career with cutting-edge AI and technology education at Vectora Computer Institute.', '', 'Start Learning', 'https://wa.me/918638373298', 1, true),
('Code Your Future', 'From web development to cybersecurity — master the skills that matter in the digital age.', '', 'Explore Courses', 'https://wa.me/918638373298', 2, true),
('Your Success Starts Here', 'Industry-relevant courses, hands-on projects, and certification that employers trust.', '', 'Get Started', 'https://wa.me/918638373298', 3, true);
