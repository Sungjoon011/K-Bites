const mongoose = require('mongoose');

const dishSchema = new mongoose.Schema({
    name: String,
    category: String,
    price: Number,
    image: String,
    description: String,
    inStock: { type: Boolean, default: true }
});

const Dish = mongoose.model('Dish', dishSchema);

const seedData = [
    {
        "name": "Classic Bibimbap",
        "category": "Bap",
        "price": 150,
        "image": "#",
        "description": "Authentic delivery-optimized classic bibimbap prepared fresh.",
        "inStock": true
    },
    {
        "name": "Beef Bulgogi Gimbap",
        "category": "Bap",
        "price": 160,
        "image": "#",
        "description": "Authentic delivery-optimized beef bulgogi gimbap prepared fresh.",
        "inStock": true
    },
    {
        "name": "Kimchi Fried Rice",
        "category": "Bap",
        "price": 170,
        "image": "#",
        "description": "Authentic delivery-optimized kimchi fried rice prepared fresh.",
        "inStock": true
    },
    {
        "name": "Spam Mayo Deopbap",
        "category": "Bap",
        "price": 180,
        "image": "#",
        "description": "Authentic delivery-optimized spam mayo deopbap prepared fresh.",
        "inStock": true
    },
    {
        "name": "Tuna Gimbap",
        "category": "Bap",
        "price": 190,
        "image": "#",
        "description": "Authentic delivery-optimized tuna gimbap prepared fresh.",
        "inStock": true
    },
    {
        "name": "Pork Cutlet Mayo Bap",
        "category": "Bap",
        "price": 200,
        "image": "#",
        "description": "Authentic delivery-optimized pork cutlet mayo bap prepared fresh.",
        "inStock": true
    },
    {
        "name": "Dolsot Bibimbap",
        "category": "Bap",
        "price": 210,
        "image": "#",
        "description": "Authentic delivery-optimized dolsot bibimbap prepared fresh.",
        "inStock": true
    },
    {
        "name": "Jumeokbap (Rice Balls)",
        "category": "Bap",
        "price": 220,
        "image": "#",
        "description": "Authentic delivery-optimized jumeokbap (rice balls) prepared fresh.",
        "inStock": true
    },
    {
        "name": "Omurice",
        "category": "Bap",
        "price": 230,
        "image": "#",
        "description": "Authentic delivery-optimized omurice prepared fresh.",
        "inStock": true
    },
    {
        "name": "Japgokbap (Multigrain Rice)",
        "category": "Bap",
        "price": 240,
        "image": "#",
        "description": "Authentic delivery-optimized japgokbap (multigrain rice) prepared fresh.",
        "inStock": true
    },
    {
        "name": "Napa Cabbage Kimchi",
        "category": "Banchan",
        "price": 50,
        "image": "#",
        "description": "Authentic delivery-optimized napa cabbage kimchi prepared fresh.",
        "inStock": true
    },
    {
        "name": "Kkakdugi (Radish Kimchi)",
        "category": "Banchan",
        "price": 60,
        "image": "#",
        "description": "Authentic delivery-optimized kkakdugi (radish kimchi) prepared fresh.",
        "inStock": true
    },
    {
        "name": "Danmuji (Yellow Radish)",
        "category": "Banchan",
        "price": 70,
        "image": "#",
        "description": "Authentic delivery-optimized danmuji (yellow radish) prepared fresh.",
        "inStock": true
    },
    {
        "name": "Kongnamul Muchim",
        "category": "Banchan",
        "price": 80,
        "image": "#",
        "description": "Authentic delivery-optimized kongnamul muchim prepared fresh.",
        "inStock": true
    },
    {
        "name": "Sigeumchi Namul (Spinach)",
        "category": "Banchan",
        "price": 90,
        "image": "#",
        "description": "Authentic delivery-optimized sigeumchi namul (spinach) prepared fresh.",
        "inStock": true
    },
    {
        "name": "Eomuk Bokkeum (Fish Cake)",
        "category": "Banchan",
        "price": 100,
        "image": "#",
        "description": "Authentic delivery-optimized eomuk bokkeum (fish cake) prepared fresh.",
        "inStock": true
    },
    {
        "name": "Gyeran Mari (Rolled Omelet)",
        "category": "Banchan",
        "price": 110,
        "image": "#",
        "description": "Authentic delivery-optimized gyeran mari (rolled omelet) prepared fresh.",
        "inStock": true
    },
    {
        "name": "Gamja Salad (Potato Salad)",
        "category": "Banchan",
        "price": 120,
        "image": "#",
        "description": "Authentic delivery-optimized gamja salad (potato salad) prepared fresh.",
        "inStock": true
    },
    {
        "name": "Myeolchi Bokkeum (Anchovies)",
        "category": "Banchan",
        "price": 130,
        "image": "#",
        "description": "Authentic delivery-optimized myeolchi bokkeum (anchovies) prepared fresh.",
        "inStock": true
    },
    {
        "name": "Seasoned Seaweed",
        "category": "Banchan",
        "price": 140,
        "image": "#",
        "description": "Authentic delivery-optimized seasoned seaweed prepared fresh.",
        "inStock": true
    },
    {
        "name": "Galbitang (Short Rib Soup)",
        "category": "Guk & Tang",
        "price": 220,
        "image": "#",
        "description": "Authentic delivery-optimized galbitang (short rib soup) prepared fresh.",
        "inStock": true
    },
    {
        "name": "Seolleongtang (Ox Bone Soup)",
        "category": "Guk & Tang",
        "price": 230,
        "image": "#",
        "description": "Authentic delivery-optimized seolleongtang (ox bone soup) prepared fresh.",
        "inStock": true
    },
    {
        "name": "Samgyetang (Ginseng Chicken)",
        "category": "Guk & Tang",
        "price": 240,
        "image": "#",
        "description": "Authentic delivery-optimized samgyetang (ginseng chicken) prepared fresh.",
        "inStock": true
    },
    {
        "name": "Miyeokguk (Seaweed Soup)",
        "category": "Guk & Tang",
        "price": 250,
        "image": "#",
        "description": "Authentic delivery-optimized miyeokguk (seaweed soup) prepared fresh.",
        "inStock": true
    },
    {
        "name": "Tteokguk (Rice Cake Soup)",
        "category": "Guk & Tang",
        "price": 260,
        "image": "#",
        "description": "Authentic delivery-optimized tteokguk (rice cake soup) prepared fresh.",
        "inStock": true
    },
    {
        "name": "Yukgaejang (Spicy Beef Soup)",
        "category": "Guk & Tang",
        "price": 270,
        "image": "#",
        "description": "Authentic delivery-optimized yukgaejang (spicy beef soup) prepared fresh.",
        "inStock": true
    },
    {
        "name": "Gomtang (Beef Bone Soup)",
        "category": "Guk & Tang",
        "price": 280,
        "image": "#",
        "description": "Authentic delivery-optimized gomtang (beef bone soup) prepared fresh.",
        "inStock": true
    },
    {
        "name": "Haejangguk (Hangover Soup)",
        "category": "Guk & Tang",
        "price": 290,
        "image": "#",
        "description": "Authentic delivery-optimized haejangguk (hangover soup) prepared fresh.",
        "inStock": true
    },
    {
        "name": "Dwaeji Gukbap (Pork Soup)",
        "category": "Guk & Tang",
        "price": 300,
        "image": "#",
        "description": "Authentic delivery-optimized dwaeji gukbap (pork soup) prepared fresh.",
        "inStock": true
    },
    {
        "name": "Eomuk Guk (Fish Cake Soup)",
        "category": "Guk & Tang",
        "price": 310,
        "image": "#",
        "description": "Authentic delivery-optimized eomuk guk (fish cake soup) prepared fresh.",
        "inStock": true
    },
    {
        "name": "Classic Kimchi Jjigae",
        "category": "Jjigae",
        "price": 250,
        "image": "#",
        "description": "Authentic delivery-optimized classic kimchi jjigae prepared fresh.",
        "inStock": true
    },
    {
        "name": "Doenjang Jjigae",
        "category": "Jjigae",
        "price": 260,
        "image": "#",
        "description": "Authentic delivery-optimized doenjang jjigae prepared fresh.",
        "inStock": true
    },
    {
        "name": "Sundubu Jjigae",
        "category": "Jjigae",
        "price": 270,
        "image": "#",
        "description": "Authentic delivery-optimized sundubu jjigae prepared fresh.",
        "inStock": true
    },
    {
        "name": "Budae Jjigae (Army Stew)",
        "category": "Jjigae",
        "price": 280,
        "image": "#",
        "description": "Authentic delivery-optimized budae jjigae (army stew) prepared fresh.",
        "inStock": true
    },
    {
        "name": "Tuna Kimchi Jjigae",
        "category": "Jjigae",
        "price": 290,
        "image": "#",
        "description": "Authentic delivery-optimized tuna kimchi jjigae prepared fresh.",
        "inStock": true
    },
    {
        "name": "Chadol Doenjang Jjigae",
        "category": "Jjigae",
        "price": 300,
        "image": "#",
        "description": "Authentic delivery-optimized chadol doenjang jjigae prepared fresh.",
        "inStock": true
    },
    {
        "name": "Cheonggukjang Jjigae",
        "category": "Jjigae",
        "price": 310,
        "image": "#",
        "description": "Authentic delivery-optimized cheonggukjang jjigae prepared fresh.",
        "inStock": true
    },
    {
        "name": "Gochujang Jjigae",
        "category": "Jjigae",
        "price": 320,
        "image": "#",
        "description": "Authentic delivery-optimized gochujang jjigae prepared fresh.",
        "inStock": true
    },
    {
        "name": "Seafood Soft Tofu Stew",
        "category": "Jjigae",
        "price": 330,
        "image": "#",
        "description": "Authentic delivery-optimized seafood soft tofu stew prepared fresh.",
        "inStock": true
    },
    {
        "name": "Pork Kimchi Jjigae",
        "category": "Jjigae",
        "price": 340,
        "image": "#",
        "description": "Authentic delivery-optimized pork kimchi jjigae prepared fresh.",
        "inStock": true
    },
    {
        "name": "Jajangmyeon",
        "category": "Myeon",
        "price": 180,
        "image": "#",
        "description": "Authentic delivery-optimized jajangmyeon prepared fresh.",
        "inStock": true
    },
    {
        "name": "Jjamppong",
        "category": "Myeon",
        "price": 190,
        "image": "#",
        "description": "Authentic delivery-optimized jjamppong prepared fresh.",
        "inStock": true
    },
    {
        "name": "Classic Ramyeon",
        "category": "Myeon",
        "price": 200,
        "image": "#",
        "description": "Authentic delivery-optimized classic ramyeon prepared fresh.",
        "inStock": true
    },
    {
        "name": "Japchae",
        "category": "Myeon",
        "price": 210,
        "image": "#",
        "description": "Authentic delivery-optimized japchae prepared fresh.",
        "inStock": true
    },
    {
        "name": "Naengmyeon (Cold Noodles)",
        "category": "Myeon",
        "price": 220,
        "image": "#",
        "description": "Authentic delivery-optimized naengmyeon (cold noodles) prepared fresh.",
        "inStock": true
    },
    {
        "name": "Bibim Naengmyeon",
        "category": "Myeon",
        "price": 230,
        "image": "#",
        "description": "Authentic delivery-optimized bibim naengmyeon prepared fresh.",
        "inStock": true
    },
    {
        "name": "Kalguksu",
        "category": "Myeon",
        "price": 240,
        "image": "#",
        "description": "Authentic delivery-optimized kalguksu prepared fresh.",
        "inStock": true
    },
    {
        "name": "Rabokki",
        "category": "Myeon",
        "price": 250,
        "image": "#",
        "description": "Authentic delivery-optimized rabokki prepared fresh.",
        "inStock": true
    },
    {
        "name": "Jjolmyeon",
        "category": "Myeon",
        "price": 260,
        "image": "#",
        "description": "Authentic delivery-optimized jjolmyeon prepared fresh.",
        "inStock": true
    },
    {
        "name": "Kongguksu",
        "category": "Myeon",
        "price": 270,
        "image": "#",
        "description": "Authentic delivery-optimized kongguksu prepared fresh.",
        "inStock": true
    },
    {
        "name": "Beef Bulgogi",
        "category": "Gui",
        "price": 300,
        "image": "#",
        "description": "Authentic delivery-optimized beef bulgogi prepared fresh.",
        "inStock": true
    },
    {
        "name": "Samgyeopsal Gui",
        "category": "Gui",
        "price": 310,
        "image": "#",
        "description": "Authentic delivery-optimized samgyeopsal gui prepared fresh.",
        "inStock": true
    },
    {
        "name": "LA Galbi",
        "category": "Gui",
        "price": 320,
        "image": "#",
        "description": "Authentic delivery-optimized la galbi prepared fresh.",
        "inStock": true
    },
    {
        "name": "Dakgalbi (Grilled Chicken)",
        "category": "Gui",
        "price": 330,
        "image": "#",
        "description": "Authentic delivery-optimized dakgalbi (grilled chicken) prepared fresh.",
        "inStock": true
    },
    {
        "name": "Grilled Mackerel",
        "category": "Gui",
        "price": 340,
        "image": "#",
        "description": "Authentic delivery-optimized grilled mackerel prepared fresh.",
        "inStock": true
    },
    {
        "name": "Beef Brisket Gui",
        "category": "Gui",
        "price": 350,
        "image": "#",
        "description": "Authentic delivery-optimized beef brisket gui prepared fresh.",
        "inStock": true
    },
    {
        "name": "Grilled Pork Ribs",
        "category": "Gui",
        "price": 360,
        "image": "#",
        "description": "Authentic delivery-optimized grilled pork ribs prepared fresh.",
        "inStock": true
    },
    {
        "name": "Spicy Grilled Pork",
        "category": "Gui",
        "price": 370,
        "image": "#",
        "description": "Authentic delivery-optimized spicy grilled pork prepared fresh.",
        "inStock": true
    },
    {
        "name": "Grilled Eel",
        "category": "Gui",
        "price": 380,
        "image": "#",
        "description": "Authentic delivery-optimized grilled eel prepared fresh.",
        "inStock": true
    },
    {
        "name": "Deodeok Gui",
        "category": "Gui",
        "price": 390,
        "image": "#",
        "description": "Authentic delivery-optimized deodeok gui prepared fresh.",
        "inStock": true
    },
    {
        "name": "Spicy Tteokbokki",
        "category": "Bokkeum",
        "price": 200,
        "image": "#",
        "description": "Authentic delivery-optimized spicy tteokbokki prepared fresh.",
        "inStock": true
    },
    {
        "name": "Rose Tteokbokki",
        "category": "Bokkeum",
        "price": 210,
        "image": "#",
        "description": "Authentic delivery-optimized rose tteokbokki prepared fresh.",
        "inStock": true
    },
    {
        "name": "Jeyuk Bokkeum (Spicy Pork)",
        "category": "Bokkeum",
        "price": 220,
        "image": "#",
        "description": "Authentic delivery-optimized jeyuk bokkeum (spicy pork) prepared fresh.",
        "inStock": true
    },
    {
        "name": "Ojingeo Bokkeum (Spicy Squid)",
        "category": "Bokkeum",
        "price": 230,
        "image": "#",
        "description": "Authentic delivery-optimized ojingeo bokkeum (spicy squid) prepared fresh.",
        "inStock": true
    },
    {
        "name": "Nakji Bokkeum (Octopus)",
        "category": "Bokkeum",
        "price": 240,
        "image": "#",
        "description": "Authentic delivery-optimized nakji bokkeum (octopus) prepared fresh.",
        "inStock": true
    },
    {
        "name": "Sausage Veggie Stir-fry",
        "category": "Bokkeum",
        "price": 250,
        "image": "#",
        "description": "Authentic delivery-optimized sausage veggie stir-fry prepared fresh.",
        "inStock": true
    },
    {
        "name": "Mushroom Stir-fry",
        "category": "Bokkeum",
        "price": 260,
        "image": "#",
        "description": "Authentic delivery-optimized mushroom stir-fry prepared fresh.",
        "inStock": true
    },
    {
        "name": "Sundae Bokkeum",
        "category": "Bokkeum",
        "price": 270,
        "image": "#",
        "description": "Authentic delivery-optimized sundae bokkeum prepared fresh.",
        "inStock": true
    },
    {
        "name": "Dak Bokkeum",
        "category": "Bokkeum",
        "price": 280,
        "image": "#",
        "description": "Authentic delivery-optimized dak bokkeum prepared fresh.",
        "inStock": true
    },
    {
        "name": "Garlic Butter Shrimp Bokkeum",
        "category": "Bokkeum",
        "price": 290,
        "image": "#",
        "description": "Authentic delivery-optimized garlic butter shrimp bokkeum prepared fresh.",
        "inStock": true
    },
    {
        "name": "Jangjorim (Braised Beef)",
        "category": "Jorim",
        "price": 120,
        "image": "#",
        "description": "Authentic delivery-optimized jangjorim (braised beef) prepared fresh.",
        "inStock": true
    },
    {
        "name": "Gamja Jorim (Potatoes)",
        "category": "Jorim",
        "price": 130,
        "image": "#",
        "description": "Authentic delivery-optimized gamja jorim (potatoes) prepared fresh.",
        "inStock": true
    },
    {
        "name": "Dubu Jorim (Braised Tofu)",
        "category": "Jorim",
        "price": 140,
        "image": "#",
        "description": "Authentic delivery-optimized dubu jorim (braised tofu) prepared fresh.",
        "inStock": true
    },
    {
        "name": "Yeongeun Jorim (Lotus Root)",
        "category": "Jorim",
        "price": 150,
        "image": "#",
        "description": "Authentic delivery-optimized yeongeun jorim (lotus root) prepared fresh.",
        "inStock": true
    },
    {
        "name": "Godeungeo Jorim (Braised Mackerel)",
        "category": "Jorim",
        "price": 160,
        "image": "#",
        "description": "Authentic delivery-optimized godeungeo jorim (braised mackerel) prepared fresh.",
        "inStock": true
    },
    {
        "name": "Galchi Jorim (Hairtail Fish)",
        "category": "Jorim",
        "price": 170,
        "image": "#",
        "description": "Authentic delivery-optimized galchi jorim (hairtail fish) prepared fresh.",
        "inStock": true
    },
    {
        "name": "Braised Quail Eggs",
        "category": "Jorim",
        "price": 180,
        "image": "#",
        "description": "Authentic delivery-optimized braised quail eggs prepared fresh.",
        "inStock": true
    },
    {
        "name": "Kkongchi Jorim",
        "category": "Jorim",
        "price": 190,
        "image": "#",
        "description": "Authentic delivery-optimized kkongchi jorim prepared fresh.",
        "inStock": true
    },
    {
        "name": "Kodari Jorim",
        "category": "Jorim",
        "price": 200,
        "image": "#",
        "description": "Authentic delivery-optimized kodari jorim prepared fresh.",
        "inStock": true
    },
    {
        "name": "Spicy Braised Chicken",
        "category": "Jorim",
        "price": 210,
        "image": "#",
        "description": "Authentic delivery-optimized spicy braised chicken prepared fresh.",
        "inStock": true
    }
];

mongoose.connect('mongodb+srv://lee294829_db_user:KBytes@cluster0.rl9gp0r.mongodb.net/kbytes')   
  .then(async () => {
      console.log('⏳ Connected to MongoDB Atlas. Clearing database...');
      await Dish.deleteMany(); 
      console.log('⏳ Seeding new dishes with # as image placeholders...');
      await Dish.insertMany(seedData);
      console.log('✅ Seeding Complete!');
      process.exit();
  })
  .catch((err) => console.log('❌ Error:', err));