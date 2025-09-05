-- Insert sample leads for demonstration (replace with actual user_id after authentication)
-- This script should be run after user signup to populate with sample data

-- Note: Replace 'USER_ID_HERE' with actual authenticated user ID
-- INSERT INTO public.leads (user_id, name, email, company, position, phone, status, source, notes, score) VALUES
-- ('USER_ID_HERE', 'John Smith', 'john.smith@techcorp.com', 'TechCorp Inc', 'CTO', '+1-555-0123', 'new', 'LinkedIn', 'Interested in our enterprise solution', 85),
-- ('USER_ID_HERE', 'Sarah Johnson', 'sarah.j@startupco.com', 'StartupCo', 'Marketing Director', '+1-555-0124', 'contacted', 'Website', 'Downloaded whitepaper, very engaged', 92),
-- ('USER_ID_HERE', 'Mike Chen', 'mike.chen@bigcorp.com', 'BigCorp Ltd', 'VP Sales', '+1-555-0125', 'qualified', 'Referral', 'Ready for demo next week', 95),
-- ('USER_ID_HERE', 'Emily Davis', 'emily@growthco.com', 'GrowthCo', 'CEO', '+1-555-0126', 'new', 'Cold Email', 'Responded to outreach campaign', 78),
-- ('USER_ID_HERE', 'David Wilson', 'david.w@innovate.com', 'Innovate Solutions', 'Product Manager', '+1-555-0127', 'contacted', 'LinkedIn', 'Scheduled follow-up call', 88);

-- Sample campaigns
-- INSERT INTO public.campaigns (user_id, name, description, status, type, target_audience, total_leads, contacted_leads, responded_leads, converted_leads) VALUES
-- ('USER_ID_HERE', 'Q1 Enterprise Outreach', 'Targeting enterprise companies for our new product launch', 'active', 'email', 'Enterprise CTOs and VPs', 25, 20, 8, 3),
-- ('USER_ID_HERE', 'LinkedIn Lead Gen', 'LinkedIn outreach campaign for startup founders', 'active', 'linkedin', 'Startup founders and CEOs', 15, 12, 5, 2),
-- ('USER_ID_HERE', 'Cold Email Campaign', 'Cold email outreach to marketing directors', 'paused', 'email', 'Marketing Directors', 30, 25, 6, 1);

-- This is a template - actual data insertion should happen through the application
SELECT 'Sample data script ready - insert data through application after user authentication' as message;
