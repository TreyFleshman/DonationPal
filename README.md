# Donation Pal Sprints 1-3

https://tech581-treyfles-donationpal.uc.r.appspot.com/

# Sprint 1

- Initalized site
- git init & commited init
- Site runs on Express Generator

# Sprint 2

- Added functionabilty for adding a new campaign
- Added local memory for stored campaigns
- Added model class and views for Campaigns
- Added a form for campaign info input
- Added router for switching pages and views

# Sprint 3

- Added a campaign list that displays all campaigns 
- Added links to view single campaigns info
- Cleaned up UI and make visual fixes
- Added bootstrap form layout and icons

# Sprint 4

- Applicaiton was connect to MongoDB
- Campaigns and Donations are stored within a collection on Mongo
- Donations are linked with what campaign the doantions has been made too 

# Sprint 5 

- Added Passport to the application
- Allows users to authenticate using Google credntials
- Passport reads users information and stores it into a session

# Sprint 6 

- Session information is wrote to MongoDB
- Users profile is populated with their information
- Users can logout 

# Sprint 7

- User interface was updated to show if users are logged in or not 
- Logged in users can now see their profile on the nav menu

# Sprint 8

- Users information is wrote to MongoDB
- Campaigns and Donations now store the users ID
- Certain features now require a user to be logged in

# Sprint 9

- Added Stripe Payment Processing API intergration
- Added a 'Confirmation' page that displays after a donation is made
- Created an 'Order' collection in MongoDB that stores users transactions

# Sprint 10

- Campaigns progress bar will be updated after a donation to the campaign is made
- Campaigns funding goal, total funding so far and remainding funding is displayed
- Added a list of donations made to that campaign, on the campaigns view page
- Donation tags display the users display name for who submited the donation