class Author {
    constructor(firstName, lastName, id) {
        this.Id = id;
        this.firstName = firstName;
        this.lastName = lastName;
    }
    getFullName() {
        return `${this.Id} ${this.firstName} ${this.lastName} `;
    }
}
const authors = [
    new Author("Jake", "Carabott", 1),
    new Author("Abigail", "Camilleri", 2),
    new Author("Marie", "Whatever", 3)
];
document.addEventListener("DOMContentLoaded", () => {
    const button = document.getElementById("GenerateButton");
    const listElement = document.getElementById("authorList");
    if (button && listElement) {
        button.addEventListener("click", () => {
            listElement.innerHTML = "";
            authors.forEach(author => {
                const li = document.createElement("li");
                li.textContent = author.getFullName();
                listElement.appendChild(li);
            });
        });
    }
});
//# sourceMappingURL=master.js.map