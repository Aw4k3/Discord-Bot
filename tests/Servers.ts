(async () => {
  const response = await fetch("http://localhost:8080/servers");
  const data = await response.json();
  console.log(data);
})();
