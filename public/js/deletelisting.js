document.querySelector('#delete').addEventListener("click", () => {
    const path = window.location.pathname;
    const id = path.replace("/listings/", "");
    axios.delete(`/listings/${id}`)
        .then(() => {
            window.location.href = "/listings";
        })
        .catch((reject) => {
            console.log(reject);
        });
});