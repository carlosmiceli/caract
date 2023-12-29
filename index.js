// createElement: A fundamental function in Caract that creates a virtual DOM element.
// - 'type': A string representing the HTML element type (e.g., 'div', 'span').
// - 'props': An object containing properties and attributes for the element.
// - '...children': Rest parameters capturing all the children elements passed.
function createElement(type, props, ...children) {
    return {
        type,
        props: {
            ...props, // Spread syntax to copy all key-value pairs from 'props' into this new object.
            // 'children' array is processed to handle text elements differently:
            // If the child is an object (like another element), it's used as-is.
            // If it's a string or number, it's converted into a text element.
            children: children.map(child =>
                typeof child === "object" ? child : createTextElement(child)
            ),
        },
    };
}

// createTextElement: Specialized function for creating text nodes.
// - 'text': A string to be displayed as text in the UI.
function createTextElement(text) {
    return {
        type: "TEXT_ELEMENT", // Indicates this is a text node.
        props: {
            nodeValue: text, // The actual text content to display.
            children: [],    // Text nodes won't have child elements.
        },
    };
}

// render: Function to render elements to the actual DOM.
// - 'element': The virtual DOM element to render.
// - 'container': The DOM node where the element should be rendered.
/**
 * Renders a React element into a DOM container.
 * @param {Object} element - The React element to render.
 * @param {HTMLElement} container - The DOM container to render the element into.
 * @returns {void}
 */
function render(element, container) {
    // Create a DOM node based on the element type.
    const dom = element.type === "TEXT_ELEMENT"
        ? document.createTextNode("") // For text elements, create a text node.
        : document.createElement(element.type); // For other types, create the respective element.

    // Apply properties and attributes to the created node.
    const isProperty = key => key !== "children";
    Object.keys(element.props)
        .filter(isProperty)
        .forEach(name => {
            dom[name] = element.props[name]; // Assign each property to the DOM node.
        });

    // Recursively render and append child elements.
    element.props.children.forEach(child =>
        render(child, dom)
    );

    // Append the newly created node to the container.
    container.appendChild(dom);
}

// Caract Library: An object containing the core functionalities of the library.
const Caract = {
    createElement,
    render,
};

// Usage Example:
/** @jsx Caract.createElement */
const element = (
    <div style="background: salmon">
        <h1>Hello World</h1>
        <h2 style="text-align:right">from Caract</h2>
    </div>
);

// Rendering the created element into the 'root' DOM node.
const container = document.getElementById("root");
Caract.render(element, container);
