/* =====================================================
   HARBOR LIGHT HOTEL
   Simple JavaScript for website buttons and forms
   ===================================================== */

// Find one element by its ID or CSS selector.
function getElement(selector) {
  return document.querySelector(selector);
}

// Find all matching elements.
function getElements(selector) {
  return document.querySelectorAll(selector);
}

// Hotel room information. Change prices and details here.
const rooms = {
  std: {
    name: "Classic Room",
    price: 89,
    size: "20 m²",
    guests: 2,
    image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1200&q=85",
    description: "A calm, beautifully considered space made for slow mornings and restful nights.",
    perks: ["Queen bed", "Rain shower", "Complimentary Wi-Fi"]
  },
  dlx: {
    name: "Deluxe Sea View",
    price: 139,
    size: "28 m²",
    guests: 3,
    image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=85",
    description: "A little more room, a little more light, and a beautiful view.",
    perks: ["King bed", "Private balcony", "Coffee machine"]
  },
  fam: {
    name: "Family Residence",
    price: 169,
    size: "40 m²",
    guests: 4,
    image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=85",
    description: "A comfortable room for the whole family.",
    perks: ["Two bedrooms", "Shared lounge", "Mini fridge"]
  },
  sui: {
    name: "The Harbor Suite",
    price: 229,
    size: "52 m²",
    guests: 4,
    image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=85",
    description: "Our signature room with extra space and thoughtful details.",
    perks: ["Freestanding bath", "Separate living room", "Late check-out"]
  }
};

// Guest reviews shown in the reviews section.
const reviews = [
  {
    quote: "We woke up to the harbor from our balcony. Breakfast alone was worth the trip.",
    name: "SARA — LAHORE"
  },
  {
    quote: "Spotless rooms and a genuinely lovely team. We arrived late and felt at home.",
    name: "DANIEL — TORONTO"
  },
  {
    quote: "The rooftop pool at sunset was the highlight of our stay.",
    name: "MEI — SINGAPORE"
  }
];

/* 1. MOBILE MENU */
const menuButton = getElement("#menuToggle");
const navigation = getElement("#mainNav");

menuButton.addEventListener("click", function () {
  navigation.classList.toggle("open");

  const menuIsOpen = navigation.classList.contains("open");
  menuButton.setAttribute("aria-expanded", menuIsOpen);
});

// Close the menu after clicking a navigation link.
getElements("#mainNav a").forEach(function (link) {
  link.addEventListener("click", function () {
    navigation.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
  });
});

/* 2. HEADER AND SCROLL PROGRESS */
window.addEventListener("scroll", function () {
  const page = document.documentElement;
  const scrollAmount = page.scrollTop;
  const pageHeight = page.scrollHeight - page.clientHeight;

  if (pageHeight > 0) {
    getElement("#progress").style.width = (scrollAmount / pageHeight) * 100 + "%";
  }

  getElement("#header").classList.toggle("scrolled", scrollAmount > 20);
});

/* 3. BOOKING DATE HELPERS */
const today = new Date();
today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
const todayText = today.toISOString().slice(0, 10);

// Do not allow users to select a date in the past.
["quickIn", "quickOut", "checkIn", "checkOut"].forEach(function (id) {
  getElement("#" + id).min = todayText;
});

// Calculate the number of nights between two dates.
function getNights(startDate, endDate) {
  if (!startDate || !endDate) {
    return 0;
  }

  const start = new Date(startDate + "T00:00:00");
  const end = new Date(endDate + "T00:00:00");
  return Math.round((end - start) / 86400000);
}

// Update the earliest allowed check-out date.
function updateCheckoutDate(checkInId, checkOutId) {
  const checkIn = getElement("#" + checkInId);
  const checkOut = getElement("#" + checkOutId);

  checkOut.min = checkIn.value || todayText;

  if (checkOut.value && checkOut.value <= checkIn.value) {
    checkOut.value = "";
  }
}

/* 4. BOOKING PRICE ESTIMATE */
function updateEstimate() {
  const checkIn = getElement("#checkIn").value;
  const checkOut = getElement("#checkOut").value;
  const numberOfNights = getNights(checkIn, checkOut);
  const totalBox = getElement("#estimatedTotal");

  if (numberOfNights < 1) {
    totalBox.textContent = "Choose your dates to see an estimate.";
    return;
  }

  const selectedRoom = rooms[getElement("#roomSelect").value];
  let totalPrice = numberOfNights * selectedRoom.price;

  if (getElement("#airportPickup").checked) {
    totalPrice = totalPrice + 25;
  }

  totalBox.textContent = numberOfNights + " night(s) · Estimated total: $" + totalPrice;
}

getElement("#quickIn").addEventListener("change", function () {
  updateCheckoutDate("quickIn", "quickOut");
});

getElement("#checkIn").addEventListener("change", function () {
  updateCheckoutDate("checkIn", "checkOut");
  updateEstimate();
});

getElement("#checkOut").addEventListener("change", updateEstimate);
getElement("#roomSelect").addEventListener("change", updateEstimate);
getElement("#airportPickup").addEventListener("change", updateEstimate);

// Copy dates from the small booking bar to the full booking form.
getElement("#quickBooking").addEventListener("submit", function (event) {
  event.preventDefault();

  const checkIn = getElement("#quickIn").value;
  const checkOut = getElement("#quickOut").value;

  if (getNights(checkIn, checkOut) < 1) {
    showMessage("Check-out must be after check-in.");
    return;
  }

  getElement("#checkIn").value = checkIn;
  getElement("#checkOut").value = checkOut;
  getElement("#guestCount").value = getElement("#quickGuests").value.split(" ")[0];

  updateEstimate();
  getElement("#contact").scrollIntoView({ behavior: "smooth" });
  showMessage("Your dates have been added to the booking form.");
});

/* 5. ROOM FILTERS */
getElement("#roomFilters").addEventListener("click", function (event) {
  const clickedButton = event.target.closest("[data-filter]");

  if (!clickedButton) {
    return;
  }

  const selectedFilter = clickedButton.dataset.filter;

  getElements(".filter").forEach(function (button) {
    button.classList.toggle("active", button === clickedButton);
  });

  getElements(".room-card").forEach(function (card) {
    const shouldHide = selectedFilter !== "all" && card.dataset.type !== selectedFilter;
    card.classList.toggle("hide", shouldHide);
  });
});

/* 6. ROOM DETAILS POPUP */
const roomDialog = getElement("#roomDialog");

function openRoom(roomId) {
  const room = rooms[roomId];

  if (!room) {
    return;
  }

  const roomDetails = `
    <img class="modal-room-image" src="${room.image}" alt="${room.name}">
    <div class="modal-room-copy">
      <div class="eyebrow"><span></span> YOUR PRIVATE RETREAT</div>
      <h2>${room.name}</h2>
      <p>${room.description}</p>
      <p><strong>$${room.price}</strong> / night · ${room.size} · Up to ${room.guests} guests</p>
      <ul>${room.perks.map(function (perk) {
    return "<li>" + perk + "</li>";
  }).join("")}</ul>
      <button class="button button-dark" id="chooseRoom">Choose this room ↗</button>
    </div>
  `;

  getElement("#roomDialogContent").innerHTML = roomDetails;
  roomDialog.showModal();

  getElement("#chooseRoom").addEventListener("click", function () {
    getElement("#roomSelect").value = roomId;
    updateEstimate();
    roomDialog.close();
    getElement("#contact").scrollIntoView({ behavior: "smooth" });
  });
}

getElement("#roomGrid").addEventListener("click", function (event) {
  const roomButton = event.target.closest("[data-room]");

  if (roomButton) {
    openRoom(roomButton.dataset.room);
  }
});

/* 7. GALLERY IMAGE POPUP */
const imageDialog = getElement("#imageDialog");

getElement("#galleryGrid").addEventListener("click", function (event) {
  const imageButton = event.target.closest("[data-image]");

  if (!imageButton) {
    return;
  }

  getElement("#lightboxImage").src = imageButton.dataset.image;
  imageDialog.showModal();
});

// Close popup buttons.
getElements("[data-close]").forEach(function (button) {
  button.addEventListener("click", function () {
    button.closest("dialog").close();
  });
});

// Close a popup when the user clicks outside its content.
[roomDialog, imageDialog].forEach(function (dialog) {
  dialog.addEventListener("click", function (event) {
    if (event.target === dialog) {
      dialog.close();
    }
  });
});

/* 8. CUSTOMER REVIEWS */
let currentReview = 0;

function showReview(index) {
  currentReview = (index + reviews.length) % reviews.length;

  getElement("#reviewQuote").textContent = "“" + reviews[currentReview].quote + "”";
  getElement("#reviewName").textContent = reviews[currentReview].name;
  getElement("#reviewCount").textContent = "0" + (currentReview + 1) + " / 0" + reviews.length;
}

getElement("#reviewPrev").addEventListener("click", function () {
  showReview(currentReview - 1);
});

getElement("#reviewNext").addEventListener("click", function () {
  showReview(currentReview + 1);
});

/* 9. FAQ: KEEP ONLY ONE QUESTION OPEN */
getElements(".faq-list details").forEach(function (item) {
  item.addEventListener("toggle", function () {
    if (item.open) {
      getElements(".faq-list details").forEach(function (otherItem) {
        if (otherItem !== item) {
          otherItem.open = false;
        }
      });
    }
  });
});

/* 10. BOOKING FORM */
getElement("#bookingForm").addEventListener("submit", function (event) {
  event.preventDefault();

  const name = getElement("#guestName").value.trim();
  const email = getElement("#guestEmail").value.trim();
  const checkIn = getElement("#checkIn").value;
  const checkOut = getElement("#checkOut").value;

  if (!name) {
    showMessage("Please enter your name.");
    return;
  }

  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    showMessage("Please enter a valid email address.");
    return;
  }

  const numberOfNights = getNights(checkIn, checkOut);

  if (numberOfNights < 1) {
    showMessage("Please choose valid check-in and check-out dates.");
    return;
  }

  const selectedRoom = rooms[getElement("#roomSelect").value];
  let totalPrice = numberOfNights * selectedRoom.price;

  if (getElement("#airportPickup").checked) {
    totalPrice = totalPrice + 25;
  }

  getElement("#formMessage").textContent =
    "Thank you, " + name + ". Your " + selectedRoom.name +
    " request is ready. Estimated total: $" + totalPrice +
    ". This is a demo; connect a booking service to receive real bookings.";

  showMessage("Booking details checked successfully.");
});

/* 11. SMALL MESSAGE AT THE BOTTOM OF THE SCREEN */
let messageTimer;

function showMessage(message) {
  const messageBox = getElement("#toast");

  messageBox.textContent = message;
  messageBox.classList.add("show");

  clearTimeout(messageTimer);
  messageTimer = setTimeout(function () {
    messageBox.classList.remove("show");
  }, 3000);
}
