import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import axios from "axios";
import "./App.css";
import Header from "./Header";

// API'nin temel URL'si. Django sunucunuzun çalıştığı adresi yazın.
const API_URL = "http://127.0.0.1:8000/api";

function App() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [bookingDetails, setBookingDetails] = useState({
    user_name: "",
    user_surname: "",
    phone: "",
  });
  const [message, setMessage] = useState({ type: "", text: "" });

  // Tek psikolog olduğu varsayımıyla ID'sini sabitliyoruz.
  const psychologistId = 1;

  // Tarih seçildiğinde müsait saatleri getiren useEffect
  useEffect(() => {
    if (selectedDate) {
      // Yeni tarih seçildiğinde eski seçimleri ve mesajları temizle
      setAvailableSlots([]);
      setSelectedSlot(null);
      setMessage({ type: "", text: "" });
      setIsLoading(true);

      // Tarihi YYYY-MM-DD formatına çevir
      const formattedDate = selectedDate.toISOString().split("T")[0];

      axios
        .get(
          `${API_URL}/public/available-slots/?date=${formattedDate}&psychologist_id=${psychologistId}`,
        )
        .then((response) => {
          setAvailableSlots(response.data);
        })
        .catch((error) => {
          console.error("Müsait saatler alınamadı:", error);
          setMessage({
            type: "error",
            text: "Müsait saatler getirilirken bir hata oluştu.",
          });
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [selectedDate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    if (!selectedDate || !selectedSlot) {
      setMessage({ type: "error", text: "Lütfen tarih ve saat seçin." });
      return;
    }

    const formattedDate = selectedDate.toISOString().split("T")[0];
    const bookingData = {
      ...bookingDetails,
      date: formattedDate,
      time: selectedSlot,
    };

    setIsLoading(true);
    axios
      .post(`${API_URL}/public/appointments/`, bookingData)
      .then((response) => {
        setMessage({
          type: "success",
          text: "Randevunuz başarıyla oluşturulmuştur!",
        });
        // Başarılı olursa formu ve seçimleri temizle
        setSelectedDate(null);
        setSelectedSlot(null);
        setAvailableSlots([]);
        setBookingDetails({ user_name: "", user_surname: "", phone: "" });
      })
      .catch((error) => {
        console.error("Randevu oluşturulamadı:", error.response.data);
        setMessage({
          type: "error",
          text: "Randevu oluşturulamadı. Lütfen bilgileri kontrol edin veya başka bir saat deneyin.",
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <>
      <Header></Header>
      <div className="w-full px-4 md:px-16 lg:px-24 py-8 bg-stone-50 dark:bg-neutral-950">
        <div className="prose">
          <h1 className="text">Randevu Al</h1>

          {message.text && (
            <div className={`message ${message.type}`}>{message.text}</div>
          )}

          {/* Adım 1: Tarih Seçimi */}
          <div className="step">
            <h2 className="text text-3xl">1. Adım: Bir Tarih Seçiniz</h2>
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              dateFormat="dd/MM/yyyy"
              minDate={new Date()} // Geçmiş tarihleri seçmeyi engelle
              placeholderText="Randevu tarihini seçmek için tıklayın"
              inline // Takvimi her zaman görünür yap
            />
          </div>

          {/* Adım 2: Saat Seçimi */}
          {isLoading && (
            <div className="loading">Müsait saatler yükleniyor...</div>
          )}
          {availableSlots.length > 0 && (
            <div className="step">
              <h2>2. Adım: Müsait Bir Saat Seçin</h2>
              <div className="time-slots-container">
                {availableSlots.map((slot) => (
                  <button
                    key={slot}
                    className={`time-slot-btn ${selectedSlot === slot ? "selected" : ""}`}
                    onClick={() => setSelectedSlot(slot)}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Adım 3: Bilgileri Girme ve Randevu Alma */}
          {selectedSlot && (
            <div className="step">
              <h2>3. Adım: Bilgilerinizi Girin ve Randevuyu Onaylayın</h2>
              <form onSubmit={handleBookingSubmit} className="booking-form">
                <div className="form-group">
                  <label htmlFor="user_name">Adınız</label>
                  <input
                    type="text"
                    id="user_name"
                    name="user_name"
                    value={bookingDetails.user_name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="user_surname">Soyadınız</label>
                  <input
                    type="text"
                    id="user_surname"
                    name="user_surname"
                    value={bookingDetails.user_surname}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="phone">Telefon Numaranız</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={bookingDetails.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="submit-btn"
                  disabled={isLoading}
                >
                  {isLoading
                    ? "İşleniyor..."
                    : `Randevuyu Onayla (${selectedSlot})`}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default App;
