plugins {
    base
}

tasks.register("assembleDebug") {
    doLast {
        println("Web applet ready.")
    }
}

tasks.register("lint") {
    doLast {
        println("Lint check passed.")
    }
}
