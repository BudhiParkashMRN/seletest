const locations = [
  { latitude: 28.6139, longitude: 77.209 }, // New Delhi
  { latitude: 19.076, longitude: 72.8777 }, // Mumbai
  { latitude: 12.9716, longitude: 77.5946 }, // Bengaluru
  { latitude: 13.0827, longitude: 80.2707 }, // Chennai
  { latitude: 22.5726, longitude: 88.3639 }, // Kolkata
  { latitude: 17.385, longitude: 78.4867 }, // Hyderabad
  { latitude: 18.5204, longitude: 73.8567 }, // Pune
  { latitude: 23.0225, longitude: 72.5714 }, // Ahmedabad
  { latitude: 26.9124, longitude: 75.7873 }, // Jaipur
  { latitude: 15.49, longitude: 73.8278 }, // Goa (Panaji)
  { latitude: 30.7333, longitude: 76.7794 }, // Chandigarh
  { latitude: 10.8505, longitude: 76.2711 }, // Kochi
  { latitude: 26.8467, longitude: 80.9462 }, // Lucknow
  { latitude: 22.7196, longitude: 75.8577 }, // Indore
  { latitude: 21.1702, longitude: 72.8311 }, // Surat
  { latitude: 28.7041, longitude: 77.1025 }, // Delhi
  { latitude: 19.2184, longitude: 72.9781 }, // Mumbai Suburbs
  { latitude: 11.0168, longitude: 76.9558 }, // Coimbatore
  { latitude: 20.2961, longitude: 85.8245 }, // Bhubaneswar
  { latitude: 27.1767, longitude: 78.0081 }, // Agra
  { latitude: 22.5726, longitude: 88.3639 }, // Kolkata
  { latitude: 19.076, longitude: 72.8777 }, // Mumbai
  { latitude: 11.0168, longitude: 76.9558 }, // Coimbatore
  { latitude: 20.2961, longitude: 85.8245 }, // Bhubaneswar
  { latitude: 27.1767, longitude: 78.0081 }, // Agra
  { latitude: 30.7333, longitude: 76.7794 }, // Chandigarh
  { latitude: 9.9312, longitude: 76.2673 }, // Thiruvananthapuram
  { latitude: 22.7196, longitude: 75.8577 }, // Indore
  { latitude: 21.1702, longitude: 72.8311 }, // Surat
  { latitude: 28.4595, longitude: 77.0266 }, // Delhi
  { latitude: 21.1458, longitude: 79.0882 }, // Nagpur
  { latitude: 17.385, longitude: 78.4867 }, // Hyderabad
  { latitude: 18.5204, longitude: 73.8567 }, // Pune
  { latitude: 22.5597, longitude: 88.3639 }, // Kolkata
  { latitude: 30.7333, longitude: 76.7794 }, // Chandigarh
  { latitude: 19.076, longitude: 72.8777 }, // Mumbai
  { latitude: 12.9716, longitude: 77.5946 }, // Bengaluru
  { latitude: 13.0827, longitude: 80.2707 }, // Chennai
  { latitude: 22.5726, longitude: 88.3639 }, // Kolkata
  { latitude: 17.385, longitude: 78.4867 }, // Hyderabad
  { latitude: 18.5204, longitude: 73.8567 }, // Pune
  { latitude: 23.0225, longitude: 72.5714 }, // Ahmedabad
  { latitude: 26.9124, longitude: 75.7873 }, // Jaipur
  { latitude: 15.49, longitude: 73.8278 }, // Goa (Panaji)
  { latitude: 27.1767, longitude: 78.0081 }, // Agra
  { latitude: 30.7333, longitude: 76.7794 }, // Chandigarh
  { latitude: 11.0168, longitude: 76.9558 }, // Coimbatore
  { latitude: 20.2961, longitude: 85.8245 }, // Bhubaneswar
  { latitude: 9.9312, longitude: 76.2673 }, // Thiruvananthapuram
  { latitude: 21.1458, longitude: 79.0882 }, // Nagpur
  { latitude: 19.076, longitude: 72.8777 }, // Mumbai
  { latitude: 26.8467, longitude: 80.9462 }, // Lucknow
  { latitude: 22.7196, longitude: 75.8577 }, // Indore
  { latitude: 21.1702, longitude: 72.8311 }, // Surat
  { latitude: 28.4595, longitude: 77.0266 }, // Delhi
  { latitude: 30.7333, longitude: 76.7794 }, // Chandigarh
  { latitude: 15.3173, longitude: 75.7139 }, // Hubli
  { latitude: 11.0168, longitude: 76.9558 }, // Coimbatore
  { latitude: 17.385, longitude: 78.4867 }, // Hyderabad
  { latitude: 20.2961, longitude: 85.8245 }, // Bhubaneswar
  { latitude: 18.5204, longitude: 73.8567 }, // Pune
  { latitude: 19.2184, longitude: 72.9781 }, // Mumbai Suburbs
  { latitude: 26.8467, longitude: 80.9462 }, // Lucknow
  { latitude: 22.5726, longitude: 88.3639 }, // Kolkata
  { latitude: 12.9716, longitude: 77.5946 }, // Bengaluru
  { latitude: 13.0827, longitude: 80.2707 }, // Chennai
  { latitude: 28.6139, longitude: 77.209 }, // New Delhi
  { latitude: 21.1702, longitude: 72.8311 }, // Surat
  { latitude: 21.1458, longitude: 79.0882 }, // Nagpur
  { latitude: 9.9312, longitude: 76.2673 }, // Thiruvananthapuram
  { latitude: 22.7196, longitude: 75.8577 }, // Indore
  { latitude: 19.076, longitude: 72.8777 }, // Mumbai
  { latitude: 10.8505, longitude: 76.2711 }, // Kochi
  { latitude: 21.1458, longitude: 79.0882 }, // Nagpur
  { latitude: 11.0168, longitude: 76.9558 }, // Coimbatore
  { latitude: 22.5726, longitude: 88.3639 }, // Kolkata
  { latitude: 30.7333, longitude: 76.7794 }, // Chandigarh
  { latitude: 28.6139, longitude: 77.209 }, // New Delhi
  { latitude: 12.9716, longitude: 77.5946 }, // Bengaluru
  { latitude: 13.0827, longitude: 80.2707 }, // Chennai
  { latitude: 21.1702, longitude: 72.8311 }, // Surat
  { latitude: 20.2961, longitude: 85.8245 }, // Bhubaneswar
  { latitude: 19.076, longitude: 72.8777 }, // Mumbai
  { latitude: 28.4595, longitude: 77.0266 }, // Delhi
  { latitude: 30.7333, longitude: 76.7794 }, // Chandigarh
  { latitude: 22.5726, longitude: 88.3639 }, // Kolkata
  { latitude: 26.9124, longitude: 75.7873 }, // Jaipur
];

module.exports = locations;
