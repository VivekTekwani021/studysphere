exports.calculatePercentage = (attended, total) => {
  if (total === 0) return 0;
  return Math.round((attended / total) * 100);
};

exports.calculateStatus = (percentage) => {
  if (percentage >= 75) return "Safe";
  if (percentage >= 65) return "Manageable";
  return "Risk";
};
