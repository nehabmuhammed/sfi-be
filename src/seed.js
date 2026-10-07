import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Announcement from './models/Announcement.js';
import Excom from './models/Excom.js';
import Programme from './models/Programme.js';
import Gallery from './models/Gallery.js';

dotenv.config();

const excomData = [
  { role: 'പ്രസിഡന്റ്', name: 'XXXX XXXX', image: '/images/excom/president.jpg', order: 1 },
  { role: 'സെക്രട്ടറി', name: 'XXXX XXXX', image: '/images/excom/secretary.jpg', order: 2 },
  { role: 'വൈസ് പ്രസിഡന്റ്', name: 'XXXX XXXX', image: '/images/excom/vice-president.jpg', order: 3 },
  { role: 'ജോയിന്റ് സെക്രട്ടറി', name: 'XXXX XXXX', image: '/images/excom/joint-secretary.jpg', order: 4 },
  { role: 'ട്രഷറർ', name: 'XXXX XXXX', image: '/images/excom/treasurer.jpg', order: 5 },
  { role: 'കമ്മിറ്റി അംഗം', name: 'XXXX XXXX', image: '/images/excom/member.jpg', order: 6 },
];

const galleryData = [
  { image: '/images/gallery/gallery-01.jpg', caption: 'യൂണിയൻ പ്രവർത്തനം 1', order: 1 },
  { image: '/images/gallery/gallery-02.jpg', caption: 'യൂണിയൻ പ്രവർത്തനം 2', order: 2 },
  { image: '/images/gallery/gallery-03.jpg', caption: 'യൂണിയൻ പ്രവർത്തനം 3', order: 3 },
  { image: '/images/gallery/gallery-04.jpg', caption: 'യൂണിയൻ പ്രവർത്തനം 4', order: 4 },
];

const programmesData = [
  { date: '12', month: 'ഒക്ടോ', title: 'വിദ്യാർത്ഥി സംഗമം', description: 'ക്യാമ്പസിലെ വിദ്യാർത്ഥികളുടെ കൂട്ടായ്മയും സംവാദവും', venue: 'കോളേജ് ഓഡിറ്റോറിയം', time: '10.30 AM', image: '/images/programme-01.jpg' },
  { date: '18', month: 'ഒക്ടോ', title: 'സാംസ്കാരിക പരിപാടി', description: 'കോളേജ് ഗ്രൗണ്ട്', venue: 'കോളേജ് ഗ്രൗണ്ട്', time: '04.00 PM', image: '/images/programme-01.jpg' },
  { date: '25', month: 'ഒക്ടോ', title: 'പുസ്തക പ്രദർശനം', description: 'വിദ്യാർത്ഥികൾക്കായുള്ള പുസ്തക പ്രദർശനവും വിൽപ്പനയും', venue: 'ലൈബ്രറി ഹാൾ', time: '10.00 AM', image: '/images/programme-01.jpg' },
];

const announcementData = {
  title: 'വിദ്യാർത്ഥികൾക്കായുള്ള പുതിയ പരിപാടി',
  description: 'വിദ്യാർത്ഥികൾക്കായുള്ള പുതിയ പരിപാടിയുടെ വിശദാംശങ്ങൾ ഉടൻ അറിയിക്കുന്നതാണ്'
};

const seedDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI;
    if (!mongoURI) throw new Error('MONGO_URI is missing');
    await mongoose.connect(mongoURI);
    console.log('MongoDB connected for seeding');

    await Announcement.deleteMany();
    await Excom.deleteMany();
    await Programme.deleteMany();
    await Gallery.deleteMany();
    console.log('Cleared existing data');

    await Announcement.create(announcementData);
    await Excom.insertMany(excomData);
    await Programme.insertMany(programmesData);
    await Gallery.insertMany(galleryData);

    console.log('Data seeded successfully');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedDB();
