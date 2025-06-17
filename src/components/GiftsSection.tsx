
import React, { useState } from 'react';

const GiftsSection = () => {
  const [showGiftForm, setShowGiftForm] = useState(false);

  const gifts = [
    {
      emoji: "🌸",
      title: "Beautiful Flowers",
      description: "Fresh bouquets and arrangements for any occasion",
      price: "From 150 SAR",
      bgColor: "from-pink-100 to-rose-100"
    },
    {
      emoji: "🎂",
      title: "Custom Cakes",
      description: "Delicious cakes customized for your celebration",
      price: "From 200 SAR",
      bgColor: "from-yellow-100 to-orange-100"
    },
    {
      emoji: "💎",
      title: "Elegant Jewelry",
      description: "Stunning pieces that make lasting impressions",
      price: "From 300 SAR",
      bgColor: "from-purple-100 to-indigo-100"
    },
    {
      emoji: "🌺",
      title: "Luxury Perfumes",
      description: "Premium fragrances from top brands",
      price: "From 250 SAR",
      bgColor: "from-blue-100 to-cyan-100"
    },
    {
      emoji: "📱",
      title: "Tech Gadgets",
      description: "Latest electronics and accessories",
      price: "From 400 SAR",
      bgColor: "from-gray-100 to-slate-100"
    }
  ];

  return (
    <section id="gifts" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            🎁 Popular Gift Ideas
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose from our curated collection of thoughtful gifts, or suggest your own
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {gifts.map((gift, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className={`h-48 bg-gradient-to-br ${gift.bgColor} flex items-center justify-center`}>
                <div className="text-6xl">{gift.emoji}</div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{gift.title}</h3>
                <p className="text-gray-600 mb-4">{gift.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-emerald-600 font-semibold">{gift.price}</span>
                  <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors">
                    Choose This
                  </button>
                </div>
              </div>
            </div>
          ))}

          <div className="bg-gradient-to-br from-emerald-100 to-teal-100 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow border-2 border-dashed border-emerald-300">
            <div className="h-48 flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4">💡</div>
                <p className="text-emerald-700 font-semibold">Have something else in mind?</p>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Submit Your Idea</h3>
              <p className="text-gray-600 mb-4">Tell us what gift you'd like to give</p>
              <button 
                onClick={() => setShowGiftForm(!showGiftForm)}
                className="w-full bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
              >
                Submit Your Gift
              </button>
            </div>
          </div>
        </div>

        {showGiftForm && (
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Suggest Your Gift Idea</h3>
            <form className="space-y-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Gift Name</label>
                <input type="text" placeholder="What's the gift?" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Description</label>
                <textarea placeholder="Tell us more about this gift..." rows={4} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"></textarea>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Estimated Price Range</label>
                  <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500">
                    <option>Under 100 SAR</option>
                    <option>100-300 SAR</option>
                    <option>300-500 SAR</option>
                    <option>500-1000 SAR</option>
                    <option>Over 1000 SAR</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Your Email</label>
                  <input type="email" placeholder="your@email.com" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                </div>
              </div>
              <div className="flex gap-4 pt-4">
                <button 
                  type="button" 
                  onClick={() => setShowGiftForm(false)}
                  className="flex-1 border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button type="submit" className="flex-1 bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors">
                  Submit Suggestion
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </section>
  );
};

export default GiftsSection;
