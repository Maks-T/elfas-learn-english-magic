
import { Topic } from '../types';

export const TOPICS: Topic[] = [
  // --- A1 LEVEL ---
  {
    id: 'cafe',
    title: 'Ordering Coffee',
    icon: 'fa-mug-hot',
    difficulty: 'A1',
    description: 'Basic daily interaction in a cafe.',
    systemPrompt: "You are Elfas, a friendly barista. Use simple A1-level English.",
    initialMessage: "Hello! What can I get for you today?"
  },
  {
    id: 'grocery',
    title: 'Grocery Store',
    icon: 'fa-basket-shopping',
    difficulty: 'A1',
    description: 'Buying food and asking for prices.',
    systemPrompt: "You are a shop assistant. Use very simple English, focusing on food and numbers.",
    initialMessage: "Hi! Do you need any help finding something?"
  },
  {
    id: 'post-office',
    title: 'At the Post Office',
    icon: 'fa-envelope',
    difficulty: 'A1',
    description: 'Sending a letter or parcel.',
    systemPrompt: "You work at a post office. Help the user send a letter.",
    initialMessage: "Good morning. Next in line, please! How can I help you?"
  },
  {
    id: 'greetings',
    title: 'Meeting Someone New',
    icon: 'fa-handshake-simple',
    difficulty: 'A1',
    description: 'Basic introductions and personal info.',
    systemPrompt: "You are meeting the user for the first time. Ask simple questions about name, job, and hobbies.",
    initialMessage: "Hi there! I'm Elfas. Nice to meet you. What's your name?"
  },
  {
    id: 'shopping-basic',
    title: 'Buying a Souvenir',
    icon: 'fa-gift',
    difficulty: 'A1',
    description: 'Simple transaction in a gift shop.',
    systemPrompt: "You are a souvenir shop owner. Sell postcards and magnets.",
    initialMessage: "Hello! We have beautiful magnets here. Are you looking for a gift?"
  },

  // --- A2 LEVEL ---
  {
    id: 'airport',
    title: 'At the Airport',
    icon: 'fa-plane-arrival',
    difficulty: 'A2',
    description: 'Check-in and security procedures.',
    systemPrompt: "You are airport staff. Use standard travel English.",
    initialMessage: "Good morning. Passport and tickets, please."
  },
  {
    id: 'hotel',
    title: 'Hotel Check-in',
    icon: 'fa-hotel',
    difficulty: 'A2',
    description: 'Checking in and asking about breakfast.',
    systemPrompt: "You are a hotel receptionist. Help the user check into their room.",
    initialMessage: "Welcome to the Grand Hotel. Do you have a reservation?"
  },
  {
    id: 'directions',
    title: 'Asking for Directions',
    icon: 'fa-map-location-dot',
    difficulty: 'A2',
    description: 'Finding your way around a city.',
    systemPrompt: "You are a local person. Give simple directions (left, right, straight).",
    initialMessage: "Excuse me, you look lost. Can I help you find something?"
  },
  {
    id: 'hair-salon',
    title: 'At the Hair Salon',
    icon: 'fa-scissors',
    difficulty: 'A2',
    description: 'Explain what kind of haircut you want.',
    systemPrompt: "You are a hairdresser. Ask the user how they want their hair done.",
    initialMessage: "Hi! Please, take a seat. How would you like your hair cut today?"
  },
  {
    id: 'lost-luggage',
    title: 'Lost Luggage',
    icon: 'fa-suitcase-rolling',
    difficulty: 'A2',
    description: 'Reporting a missing bag at the airport.',
    systemPrompt: "You are a baggage claim agent. Take a report for a lost suitcase.",
    initialMessage: "I'm sorry your bag didn't arrive. Can you describe it for me?"
  },
  {
    id: 'weather-talk',
    title: 'Weather Forecast',
    icon: 'fa-cloud-sun',
    difficulty: 'A2',
    description: 'Talking about the weather and plans.',
    systemPrompt: "You are a friend. Start a conversation about the weather today.",
    initialMessage: "It's such a lovely day, isn't it? I hope it doesn't rain later."
  },
  {
    id: 'pet-adoption',
    title: 'Pet Shelter',
    icon: 'fa-dog',
    difficulty: 'A2',
    description: 'Choosing a cat or a dog to adopt.',
    systemPrompt: "You work at a pet shelter. Describe the animals available for adoption.",
    initialMessage: "Hello! Are you looking for a new furry friend today?"
  },
  {
    id: 'bus-station',
    title: 'Bus Station',
    icon: 'fa-bus',
    difficulty: 'A2',
    description: 'Buying a ticket and asking about the schedule.',
    systemPrompt: "You are a ticket seller. Provide info about bus times and prices.",
    initialMessage: "Next! Where are you traveling to today?"
  },

  // --- B1 LEVEL ---
  {
    id: 'doctor',
    title: "Doctor's Appointment",
    icon: 'fa-user-doctor',
    difficulty: 'B1',
    description: 'Discuss symptoms and medical advice.',
    systemPrompt: "You are Dr. Elfas. Use clear B1-level medical English.",
    initialMessage: "Hello. What seems to be the problem today?"
  },
  {
    id: 'pharmacy',
    title: 'At the Pharmacy',
    icon: 'fa-prescription-bottle-medical',
    difficulty: 'B1',
    description: 'Buying medicine and asking for instructions.',
    systemPrompt: "You are a pharmacist. Explain how to take the medication.",
    initialMessage: "Hello. Do you have a prescription, or are you looking for something else?"
  },
  {
    id: 'fitness',
    title: 'Fitness Center',
    icon: 'fa-dumbbell',
    difficulty: 'B1',
    description: 'Talking to a personal trainer.',
    systemPrompt: "You are a personal trainer. Ask about fitness goals and suggest exercises.",
    initialMessage: "Welcome to the gym! What are your goals for today's workout?"
  },
  {
    id: 'party',
    title: 'Social Gathering',
    icon: 'fa-champagne-glasses',
    difficulty: 'B1',
    description: 'Making small talk at a party.',
    systemPrompt: "You are a guest at a party. Chat about hobbies, work, and travel.",
    initialMessage: "Hey! Nice party, right? How do you know the host?"
  },
  {
    id: 'museum',
    title: 'Museum Tour',
    icon: 'fa-landmark',
    difficulty: 'B1',
    description: 'Asking a guide about history.',
    systemPrompt: "You are a museum guide. Explain the history of an exhibit.",
    initialMessage: "This painting is from the 18th century. Do you have any questions about the artist?"
  },
  {
    id: 'cooking-class',
    title: 'Cooking Class',
    icon: 'fa-kitchen-set',
    difficulty: 'B1',
    description: 'Following a recipe and instructions.',
    systemPrompt: "You are Chef Elfas. Guide the user through making a simple dish.",
    initialMessage: "Alright everyone, today we're making fresh pasta. Ready to start?"
  },
  {
    id: 'dating',
    title: 'First Date',
    icon: 'fa-heart',
    difficulty: 'B1',
    description: 'Casual conversation to get to know someone.',
    systemPrompt: "You are on a first date. Be polite and ask about interests.",
    initialMessage: "You look great today! So, tell me, what do you do for fun?"
  },
  {
    id: 'theater',
    title: 'Theater Tickets',
    icon: 'fa-masks-theater',
    difficulty: 'B1',
    description: 'Booking seats for a Broadway show.',
    systemPrompt: "You work at the box office. Help the user pick the best seats.",
    initialMessage: "Welcome to the Majestic Theatre. Which show would you like to see?"
  },
  {
    id: 'sports-talk',
    title: 'Sports Commentary',
    icon: 'fa-futbol',
    difficulty: 'B1',
    description: 'Discussing the latest match and players.',
    systemPrompt: "You are a sports fan. Talk about a recent game enthusiastically.",
    initialMessage: "Did you see that goal last night? It was absolutely incredible!"
  },
  {
    id: 'gardening',
    title: 'Gardening Talk',
    icon: 'fa-leaf',
    difficulty: 'B1',
    description: 'Discussing plants and garden care.',
    systemPrompt: "You are a fellow gardener. Share tips on growing vegetables or flowers.",
    initialMessage: "My roses are finally blooming! How is your garden doing this spring?"
  },
  {
    id: 'volunteering',
    title: 'Volunteering',
    icon: 'fa-hand-holding-heart',
    difficulty: 'B1',
    description: 'Signing up for a community project.',
    systemPrompt: "You are a volunteer coordinator. Explain the different tasks available.",
    initialMessage: "Thank you for wanting to help! We have projects at the park and the shelter. Which interests you?"
  },
  {
    id: 'wedding-planning',
    title: 'Wedding Planning',
    icon: 'fa-ring',
    difficulty: 'B1',
    description: 'Discussing venues and flowers.',
    systemPrompt: "You are a wedding planner. Help the user organize their big day.",
    initialMessage: "Congratulations! Let's start with the guest list and the theme. What's your vision?"
  },

  // --- B2 LEVEL ---
  {
    id: 'interview',
    title: 'Job Interview',
    icon: 'fa-briefcase',
    difficulty: 'B2',
    description: 'Professional interview practice.',
    systemPrompt: "You are a Senior HR Manager. Ask challenging but fair interview questions.",
    initialMessage: "Thank you for coming. Why do you think you're the right fit for this role?"
  },
  {
    id: 'meeting',
    title: 'Workplace Meeting',
    icon: 'fa-chart-line',
    difficulty: 'B2',
    description: 'Presenting ideas and handling feedback.',
    systemPrompt: "You are a project manager. Lead a meeting about a new campaign.",
    initialMessage: "Alright team, let's look at the numbers. Any thoughts on our strategy for next month?"
  },
  {
    id: 'bank',
    title: 'Bank Services',
    icon: 'fa-building-columns',
    difficulty: 'B2',
    description: 'Opening an account or applying for a loan.',
    systemPrompt: "You are a bank advisor. Explain different financial products.",
    initialMessage: "Good morning. How can I help you with your banking needs today?"
  },
  {
    id: 'car-rental',
    title: 'Car Rental',
    icon: 'fa-car',
    difficulty: 'B2',
    description: 'Renting a car and discussing insurance.',
    systemPrompt: "You are a car rental agent. Explain the fuel policy and insurance options.",
    initialMessage: "Welcome to Speedy Rentals. What kind of vehicle are you looking for?"
  },
  {
    id: 'complaint',
    title: 'Making a Complaint',
    icon: 'fa-circle-exclamation',
    difficulty: 'B2',
    description: 'Handling a service issue professionally.',
    systemPrompt: "You are a customer service manager. Deal with a user's complaint calmly.",
    initialMessage: "I understand you're unhappy with the service. Could you tell me exactly what happened?"
  },
  {
    id: 'parent-teacher',
    title: 'Parent-Teacher Meeting',
    icon: 'fa-chalkboard-user',
    difficulty: 'B2',
    description: 'Discussing a student\'s progress and behavior.',
    systemPrompt: "You are a teacher. Discuss a student's performance with their parent.",
    initialMessage: "Thank you for coming in today. Let's talk about your child's recent grades."
  },
  {
    id: 'emergency',
    title: 'Emergency Call',
    icon: 'fa-phone-emergency',
    difficulty: 'B2',
    description: 'Reporting an incident to an operator.',
    systemPrompt: "You are a 911 operator. Stay calm and get all the necessary details.",
    initialMessage: "Emergency services. What is your location and what's the nature of the emergency?"
  },
  {
    id: 'apartment-viewing',
    title: 'Apartment Viewing',
    icon: 'fa-house',
    difficulty: 'B2',
    description: 'Asking about rent, utilities, and the area.',
    systemPrompt: "You are a real estate agent. Show the user around a new apartment.",
    initialMessage: "This is a very popular building. What do you think of the living room space?"
  },
  {
    id: 'immigration',
    title: 'Border Control',
    icon: 'fa-passport',
    difficulty: 'B2',
    description: 'Answering questions at customs and immigration.',
    systemPrompt: "You are a border control officer. Ask about the purpose and length of the visit.",
    initialMessage: "Passport and visa, please. What is the reason for your visit to the country?"
  },
  {
    id: 'tech-support',
    title: 'Tech Support',
    icon: 'fa-headset',
    difficulty: 'B2',
    description: 'Troubleshooting a technical problem.',
    systemPrompt: "You are a tech support agent. Help the user fix their internet connection.",
    initialMessage: "Thank you for calling support. Can you tell me which lights are flashing on your router?"
  },
  {
    id: 'marketing',
    title: 'Marketing Strategy',
    icon: 'fa-bullhorn',
    difficulty: 'B2',
    description: 'Discussing target audience and social media.',
    systemPrompt: "You are a marketing consultant. Help the user plan a product launch.",
    initialMessage: "Who is our primary demographic for this product? Let's talk about our ad spend."
  },

  // --- C1 LEVEL ---
  {
    id: 'negotiation',
    title: 'Business Negotiation',
    icon: 'fa-handshake',
    difficulty: 'C1',
    description: 'Bargaining for a better deal or contract.',
    systemPrompt: "You are a tough business negotiator. Use persuasive and professional English.",
    initialMessage: "We've reviewed your proposal. The price is a bit high for our current budget. What can you offer?"
  },
  {
    id: 'science',
    title: 'Science Lab',
    icon: 'fa-microscope',
    difficulty: 'C1',
    description: 'Discussing research data and hypotheses.',
    systemPrompt: "You are a lead scientist. Discuss complex data and experimental results.",
    initialMessage: "The recent findings are quite surprising. How do you interpret the data anomaly?"
  },
  {
    id: 'startup',
    title: 'Startup Pitch',
    icon: 'fa-lightbulb',
    difficulty: 'C1',
    description: 'Presenting an idea to venture capitalists.',
    systemPrompt: "You are an investor. Ask deep questions about market fit and scalability.",
    initialMessage: "You have five minutes. What makes your solution better than the competitors?"
  },
  {
    id: 'eco-activism',
    title: 'Eco-discussion',
    icon: 'fa-leaf-heart',
    difficulty: 'C1',
    description: 'Debating environmental policy and ethics.',
    systemPrompt: "You are an environmental activist. Debate sustainable practices and climate change.",
    initialMessage: "Carbon neutrality is no longer enough. We need radical change. What are your thoughts?"
  },
  {
    id: 'university-admission',
    title: 'University Admission',
    icon: 'fa-graduation-cap',
    difficulty: 'C1',
    description: 'Interview for a prestigious degree program.',
    systemPrompt: "You are an admissions officer. Evaluate the candidate's academic potential.",
    initialMessage: "Why did you choose our university, and how will this degree further your research goals?"
  },
  {
    id: 'philosophy',
    title: 'Philosophy Class',
    icon: 'fa-brain',
    difficulty: 'C1',
    description: 'Discussing ethics and existentialism.',
    systemPrompt: "You are a philosophy professor. Challenge the user's views on morality and society.",
    initialMessage: "Today we're discussing the concept of free will. Do you believe we are truly in control?"
  },
  {
    id: 'ai-ethics',
    title: 'AI Ethics Debate',
    icon: 'fa-robot',
    difficulty: 'C1',
    description: 'Discussing the future of artificial intelligence.',
    systemPrompt: "You are a tech ethicist. Debate the risks and benefits of AGI.",
    initialMessage: "As AI grows more powerful, how do we ensure it remains aligned with human values?"
  },
  {
    id: 'book-club-c1',
    title: 'Literary Analysis',
    icon: 'fa-book-open-reader',
    difficulty: 'C1',
    description: 'Analyzing themes and symbolism in literature.',
    systemPrompt: "You are a literature expert. Discuss the deeper meaning of a classic novel.",
    initialMessage: "Let's look at the recurring symbolism of water in this chapter. What do you think it represents?"
  },
  {
    id: 'legal-advice-c1',
    title: 'Legal Consultation',
    icon: 'fa-scale-balanced',
    difficulty: 'C1',
    description: 'Discussing liability and contract clauses.',
    systemPrompt: "You are a senior lawyer. Use precise legal terminology to discuss a case.",
    initialMessage: "The breach of contract seems evident, but we need to prove intentional negligence. Any ideas?"
  },
  {
    id: 'astronomy',
    title: 'Space Exploration',
    icon: 'fa-user-astronaut',
    difficulty: 'C1',
    description: 'Discussing the colonization of Mars.',
    systemPrompt: "You are an aerospace engineer. Talk about the technical and ethical challenges of space travel.",
    initialMessage: "Terraforming Mars is a massive undertaking. Which aspect do you think is the most difficult?"
  }
];
