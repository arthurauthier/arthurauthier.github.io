/*
 * ======================================================
 * VÉRIFICATION DES CONDITIONS
 * ======================================================
 */

const canvas = document.getElementById("background-canvas");
const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
).matches;

let renderer;
let scene;
let camera;
let points;
let lines;

let animationFrame;

let isPageVisible = !document.hidden;


/*
 * ======================================================
 * SI LES ANIMATIONS SONT DÉSACTIVÉES
 * ======================================================
 */

if (reduceMotion) {

    canvas.style.display = "none";

} else if (
    !window.WebGLRenderingContext ||
    !THREE
) {

    canvas.style.display = "none";

} else {

    initializeBackground();

}


/*
 * ======================================================
 * INITIALISATION
 * ======================================================
 */

function initializeBackground() {

    try {

        renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            antialias: true,
            alpha: true
        });

        renderer.setPixelRatio(
            Math.min(window.devicePixelRatio, 2)
        );

        renderer.setSize(
            window.innerWidth,
            window.innerHeight
        );


        /*
         * SCÈNE
         */

        scene = new THREE.Scene();


        /*
         * CAMÉRA
         */

        camera = new THREE.PerspectiveCamera(
            55,
            window.innerWidth / window.innerHeight,
            0.1,
            100
        );

        camera.position.z = 7;


        /*
         * PARTICULES
         */

        const particleCount = 150;

        const positions = new Float32Array(
            particleCount * 3
        );

        const particleData = [];

        for (
            let i = 0;
            i < particleCount;
            i++
        ) {

            const x =
                (Math.random() - 0.5) * 12;

            const y =
                (Math.random() - 0.5) * 7;

            const z =
                (Math.random() - 0.5) * 4;

            positions[i * 3] = x;
            positions[i * 3 + 1] = y;
            positions[i * 3 + 2] = z;

            particleData.push({
                x: x,
                y: y,
                z: z,

            });

        }


        /*
         * GÉOMÉTRIE DES POINTS
         */

        const pointGeometry =
            new THREE.BufferGeometry();

        pointGeometry.setAttribute(
            "position",
            new THREE.BufferAttribute(
                positions,
                3
            )
        );


        /*
         * MATÉRIAU DES POINTS
         */

        const pointMaterial =
            new THREE.PointsMaterial({

                color: 0x7029ff,

                size: 0.045,

                transparent: true,

                opacity: 0.75

            });


        points =
            new THREE.Points(
                pointGeometry,
                pointMaterial
            );

        scene.add(points);


        /*
         * LIGNES ENTRE LES PARTICULES
         */

        const linePositions = [];

        const maxDistance = 1.5;

        for (
            let i = 0;
            i < particleCount;
            i++
        ) {

            for (
                let j = i + 1;
                j < particleCount;
                j++
            ) {

                const dx =
                    particleData[i].x -
                    particleData[j].x;

                const dy =
                    particleData[i].y -
                    particleData[j].y;

                const dz =
                    particleData[i].z -
                    particleData[j].z;

                const distance =
                    Math.sqrt(
                        dx * dx +
                        dy * dy +
                        dz * dz
                    );

                if (distance < maxDistance) {

                    linePositions.push(

                        particleData[i].x,
                        particleData[i].y,
                        particleData[i].z,

                        particleData[j].x,
                        particleData[j].y,
                        particleData[j].z

                    );

                }

            }

        }


        /*
         * GÉOMÉTRIE DES LIGNES
         */

        const lineGeometry =
            new THREE.BufferGeometry();

        lineGeometry.setAttribute(
            "position",
            new THREE.Float32BufferAttribute(
                linePositions,
                3
            )
        );


        /*
         * MATÉRIAU DES LIGNES
         */

        const lineMaterial =
            new THREE.LineBasicMaterial({

                color: 0x7029ff,

                transparent: true,

                opacity: 0.12

            });


        lines =
            new THREE.LineSegments(
                lineGeometry,
                lineMaterial
            );

        scene.add(lines);


        /*
         * REDIMENSIONNEMENT
         */

        window.addEventListener(
            "resize",
            handleResize
        );


        /*
         * VISIBILITÉ DE L'ONGLET
         */

        document.addEventListener(
            "visibilitychange",
            handleVisibilityChange
        );




        /*
         * ANIMATION
         */

        animate();


    } catch (error) {

        console.warn(
            "WebGL indisponible :",
            error
        );

        canvas.style.display = "none";

    }

}


/*
 * ======================================================
 * ANIMATION
 * ======================================================
 */

function animate(time) {

    if (!isPageVisible) {

        animationFrame = null;

        return;

    }

    animationFrame =
        requestAnimationFrame(animate);


    if (!points || !lines) {
        return;
    }


    /*
     * Mouvement lent du réseau
     */

    points.rotation.y += 0.00025;

    points.rotation.x += 0.00008;

    lines.rotation.y += 0.00025;

    lines.rotation.x += 0.00008;


    /*
     * Légère dérive verticale
     */

    points.position.y =
        Math.sin(time * 0.00015) * 0.15;

    lines.position.y =
        Math.sin(time * 0.00015) * 0.15;


    renderer.render(
        scene,
        camera
    );

}


/*
 * ======================================================
 * REDIMENSIONNEMENT
 * ======================================================
 */

function handleResize() {

    if (!renderer || !camera) {
        return;
    }

    camera.aspect =
        window.innerWidth /
        window.innerHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );

}


/*
 * ======================================================
 * VISIBILITÉ
 * ======================================================
 */

function handleVisibilityChange() {

    isPageVisible =
        !document.hidden;


    if (
        isPageVisible &&
        !animationFrame
    ) {

        animate(
            performance.now()
        );

    }

}

/* Header transparency on scroll. */
const siteHeader = document.querySelector("header");
const updateHeaderTransparency = () => {
    siteHeader.classList.toggle("is-scrolled", window.scrollY > 0);
};

window.addEventListener("scroll", updateHeaderTransparency, { passive: true });
updateHeaderTransparency();
/* Mobile navigation menu controls. */
const menuToggle = document.querySelector(".menu-toggle");
const mainMenu = document.querySelector("#main-menu");

menuToggle.addEventListener("click", () => {
    const isOpen = mainMenu.classList.toggle("is-open");

    menuToggle.setAttribute("aria-expanded", isOpen);
    menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Fermer le menu" : "Ouvrir le menu"
    );
});

document.addEventListener("click", (event) => { if (!mainMenu.contains(event.target) && !menuToggle.contains(event.target)) { mainMenu.classList.remove("is-open"); menuToggle.setAttribute("aria-expanded", "false"); menuToggle.setAttribute("aria-label", "Ouvrir le menu"); } });
mainMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
        mainMenu.classList.remove("is-open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Ouvrir le menu");
    });
});
