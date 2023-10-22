import NotificationSound2 from "../assets/NotificationSound2.mp3";

function formatIndianPrice(value) {
  let valueChecked = +value || 0;
  const formattedValue = valueChecked.toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
  });

  return formattedValue;
}

function formatUSDPrice(value) {
  let valueChecked = +value || 0;
  const formattedValue = valueChecked.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });

  return formattedValue;
}
const NotificationSoundPlay = () => {
  const audio = new Audio(NotificationSound2);
  audio.play();
};

const formatDate = (dateString) => {
  if (!dateString) {
    return "";
  }
  
  const date = new Date(dateString);
  
  const options = { day: "2-digit", month: "short", year: "numeric", timeZone: "Asia/Kolkata" };
  const formattedDate = new Intl.DateTimeFormat("en-IN", options).format(date);

  return formattedDate;
};

export { formatIndianPrice, formatUSDPrice, NotificationSoundPlay ,formatDate};
