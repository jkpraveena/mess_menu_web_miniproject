import React, { useState } from "react";

const meals = {
  breakfast: [
    { id: "idli", name: "Idli", img: "https://th.bing.com/th/id/OIP.tG4rGyVbJN6lUFrlFA_IwQHaEK?rs=1&pid=ImgDetMain" },
    { id: "dosa", name: "Dosa", img: "https://i1.wp.com/www.evergreendishes.com/wp-content/uploads/2019/10/Dosa-1.jpg?fit=4288%2C2848&ssl=1" },
    { id: "corn-flakes", name: "Corn Flakes", img: "https://th.bing.com/th/id/OIP.WTkUYrAUsYo11dW7ZndCNAHaE8?rs=1&pid=ImgDetMain" },
    { id: "upma", name: "Upma", img: "https://th.bing.com/th/id/OIP.sjaz6RB_h_88N1KRB0xbIwHaHa?rs=1&pid=ImgDetMain" },
    { id: "boiled-eggs", name: "Boiled Eggs with Toast", img: "https://th.bing.com/th/id/OIP.Kq72P-6m7v4hzOrseREingHaLH?rs=1&pid=ImgDetMain" },
    { id: "chicken-sausage", name: "Chicken Sausage", img: "https://thumbs.dreamstime.com/z/scrambled-eggs-breakfast-sausage-plate-delicious-coffee-orange-juice-130543559.jpg" },
    { id: "pancakes", name: "Pancakes", img: "https://kristineskitchenblog.com/wp-content/uploads/2021/04/buttermilk-pancakes-1200-square-for-recipe-card-40.jpg" },
    { id: "poha", name: "Poha", img: "https://www.indianveggiedelight.com/wp-content/uploads/2022/07/poha-recipe-featured.jpg" },
  ],
  lunch: [
    { id: "dal-rice", name: "Dal Rice", img: "https://th.bing.com/th/id/OIP.yjByy4qyXgbwjrpNLH2RmAHaFj?w=500&h=375&rs=1&pid=ImgDetMain" },
    { id: "chicken-curry", name: "Chicken Curry", img: "https://th.bing.com/th/id/OIP.SbwVTn3QHJkveiFkZCkFzQHaHa?rs=1&pid=ImgDetMain" },
    { id: "paneer", name: "Paneer Pulao", img: "https://th.bing.com/th/id/OIP.PDEarGsxrhTJXsjK2-17uQHaHa?rs=1&pid=ImgDetMain" },
    { id: "chicken-biryani", name: "Chicken Biryani", img: "https://th.bing.com/th/id/OIP.2ZZ3vUK_NArgqMa7NO2vBwHaF1?w=540&h=426&rs=1&pid=ImgDetMain" },
    { id: "veg-biryani", name: "Veg Biryani", img: "https://www.madhuseverydayindian.com/wp-content/uploads/2022/11/easy-vegetable-biryani.jpg" },
    { id: "noodles", name: "Noodles", img: "https://i2.wp.com/vegecravings.com/wp-content/uploads/2017/03/veg-hakka-noodles-recipe-with-step-by-step-instructions.jpg?fit=1838%2C1493&quality=65&strip=all&ssl=1" },
    { id: "pasta", name: "Pasta", img: "https://yejiskitchenstories.com/wp-content/uploads/2022/11/creamy-gochujang-pasta-scaled.jpg" },
    { id: "variety-rice", name: "Variety Rice", img: "https://img.freepik.com/premium-photo/variety-different-bowls-rice-one-which-is-called-rice_889227-1454.jpg?w=900" },
  ],
  snacks: [
    { id: "samosa", name: "Samosa", img: "https://th.bing.com/th/id/R.5e9d914158f20abde43751bc56170aff?rik=IVjPf86fA0ExdQ&riu=http%3a%2f%2fwww.zedamagazine.com%2fwp-content%2fuploads%2f2018%2f06%2fIndian-Food-Samosa.jpg" },
    // Add more snacks here if needed
  ]
};

const MessMenu = () => {
  const [selected, setSelected] = useState({
    breakfast: null,
    lunch: null,
    snacks: null,
  });

  const selectItem = (mealType, itemId) => {
    setSelected(prev => ({ ...prev, [mealType]: itemId }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(JSON.stringify(selected, null, 2));
  };

  return (
    <div style={styles.page}>
      <h2 style={{ color: "#fff" }}>🍽️ Mess Menu Selection</h2>
      <form onSubmit={handleSubmit}>
        {Object.keys(meals).map(meal => (
          <div key={meal} style={styles.mealSection}>
            <div style={styles.mealTitle}>{meal.charAt(0).toUpperCase() + meal.slice(1)}</div>
            <div style={styles.foodOptions}>
              {meals[meal].map(item => (
                <div
                  key={item.id}
                  style={{
                    ...styles.foodItem,
                    border: selected[meal] === item.id ? "3px solid #007BFF" : "none"
                  }}
                  onClick={() => selectItem(meal, item.id)}
                >
                  <img src={item.img} alt={item.name} style={styles.foodImg} />
                  <p>{item.name}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
        <button type="submit" style={styles.submitBtn}>Submit</button>
      </form>
    </div>
  );
};

const styles = {
  page: {
    fontFamily: "Arial, sans-serif",
    textAlign: "center",
    margin: 20,
    backgroundImage: `url('https://wallpaperaccess.com/full/1614319.jpg')`,
    backgroundSize: "cover",
    minHeight: "100vh",
    paddingBottom: "50px"
  },
  mealSection: {
    width: "90%",
    maxWidth: 800,
    background: "white",
    padding: 15,
    borderRadius: 10,
    margin: "20px auto",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)"
  },
  mealTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10
  },
  foodOptions: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: 15,
    justifyItems: "center",
    marginTop: 10
  },
  foodItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: 180,
    cursor: "pointer",
    textAlign: "center",
    transition: "0.3s ease-in-out"
  },
  foodImg: {
    width: 180,
    height: 130,
    borderRadius: 10,
    transition: "0.3s ease-in-out"
  },
  submitBtn: {
    marginTop: 20,
    padding: "10px 20px",
    fontSize: 18,
    border: "none",
    borderRadius: 5,
    cursor: "pointer",
    backgroundColor: "#008cba",
    color: "white"
  }
};

export default MessMenu;