export default function colorText(element, textColor) {
    let containers = document.querySelectorAll(element);

    containers.forEach((container) => {
        let chars = container.innerText.split("");

        // Empty the container
        container.innerHTML = "";

        // Create spans to each letter
        chars.forEach((char, index) => {
            let newSpan = document.createElement("span");
            newSpan.innerText = char;
            newSpan.classList.add(`letter-${index}`);

            container.appendChild(newSpan);
        });

        let letterIndex = 0;
        let animation = setInterval(() => {     
            if (letterIndex > chars.length - 1) {
                clearInterval(animation);
            }   

            let char = container.querySelector(`.letter-${letterIndex % chars.length}`);
            char.style.color = textColor;
            letterIndex += 1;
        }, 30);
    });
}
