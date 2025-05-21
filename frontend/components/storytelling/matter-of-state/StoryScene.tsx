"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { StoryScene as StorySceneType } from "./data/stories";
import SolidAnimation from "./StateAnimation/SolidAnimation";
import LiquidAnimation from "./StateAnimation/LiquidAnimation";
import GasAnimation from "./StateAnimation/GasAnimation";
import TransformationAnimation from "./StateAnimation/TransformationAnimation";

interface StorySceneProps {
    scene: StorySceneType;
    characterType: "boy" | "girl";
    stage: string;
}

export default function StoryScene({ scene, characterType, stage }: StorySceneProps) {
    const [activeContentIndex, setActiveContentIndex] = useState(0);
    const [showAnimation, setShowAnimation] = useState(false);

    // Progress through the content automatically with a simple typing effect
    useEffect(() => {
        const timer = setTimeout(() => {
            if (activeContentIndex < scene.content.length - 1) {
                setActiveContentIndex(activeContentIndex + 1);
            }
        }, 5000);

        return () => clearTimeout(timer);
    }, [activeContentIndex, scene.content.length]);

    // Show animation after a delay if available
    useEffect(() => {
        if (scene.animation) {
            const timer = setTimeout(() => {
                setShowAnimation(true);
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [scene.animation]);

    // Render the appropriate animation based on the scene
    const renderAnimation = () => {
        if (!scene.animation || !showAnimation) return null;

        switch (scene.animation) {
            case "solid-molecules":
                return <SolidAnimation />;
            case "liquid-molecules":
                return <LiquidAnimation />;
            case "gas-molecules":
                return <GasAnimation />;
            case "solid-to-liquid":
                return <TransformationAnimation type="solidToLiquid" />;
            case "liquid-to-gas":
                return <TransformationAnimation type="liquidToGas" />;
            case "gas-to-liquid":
                return <TransformationAnimation type="gasToLiquid" />;
            case "liquid-to-solid":
                return <TransformationAnimation type="liquidToSolid" />;
            default:
                return null;
        }
    };

    // Determine if we should show an image or animation section
    const shouldShowVisuals = scene.imageUrl || scene.animation;

    return (
        <div className="max-w-5xl w-full mx-auto px-4">
            {/* Title */}
            <motion.h1
                className="text-2xl md:text-3xl font-bold text-center mb-8 text-indigo-700 dark:text-indigo-300"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                {scene.title}
            </motion.h1>

            {shouldShowVisuals ? (
                // Layout with image or animation
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-8">
                    {/* Image/Animation section on the left */}
                    <div className="relative rounded-lg overflow-hidden bg-white dark:bg-gray-800 shadow-lg h-[300px] md:h-[400px] order-2 md:order-1">
                        {/* Scene Image */}
                        {scene.imageUrl && (
                            <Image
                                src={scene.imageUrl}
                                alt={scene.title}
                                fill
                                className="object-contain p-4"
                                priority
                            />
                        )}

                        {/* Animation Overlay */}
                        {showAnimation && (
                            <div className="absolute inset-0 flex items-center justify-center">
                                {renderAnimation()}
                            </div>
                        )}
                    </div>

                    {/* Text content on the right */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg order-1 md:order-2">
                        <div className="space-y-5">
                            {scene.content.map((paragraph, index) => (
                                <motion.p
                                    key={index}
                                    className={`text-lg leading-relaxed ${
                                        index > activeContentIndex ? "opacity-0" : "opacity-100"
                                    } ${index === activeContentIndex ? "text-indigo-600 dark:text-indigo-400 font-medium" : "text-gray-700 dark:text-gray-300"}`}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{
                                        opacity: index <= activeContentIndex ? 1 : 0,
                                        y: index <= activeContentIndex ? 0 : 10
                                    }}
                                    transition={{ duration: 0.5, delay: index * 0.2 }}
                                >
                                    {paragraph}
                                </motion.p>
                            ))}
                        </div>

                        {/* Character bubble */}
                        <motion.div
                            className="mt-6 bg-indigo-100 dark:bg-indigo-900/40 p-4 rounded-lg border-l-4 border-indigo-500"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 1, duration: 0.5 }}
                        >
                            <div className="flex items-center">
                                <div className="relative w-10 h-10 mr-3">
                                    <Image
                                        src={`/images/storytelling/matter-of-state/character-${characterType}.gif`}
                                        alt={characterType === "boy" ? "রাজু" : "মিতা"}
                                        fill
                                        className="rounded-full object-cover"
                                    />
                                </div>
                                <p className="text-sm text-indigo-700 dark:text-indigo-300">
                                    {characterType === "boy"
                                        ? "রাজু: এই বিষয়টা আমি বন্ধুদের বলব!"
                                        : "মিতা: এই বিষয়টা জানতে পেরে আমি খুবই খুশি!"}
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            ) : (
                // Centered layout when no image or animation
                <div className="flex justify-center mb-8">
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-3xl w-full">
                        <div className="space-y-5">
                            {scene.content.map((paragraph, index) => (
                                <motion.p
                                    key={index}
                                    className={`text-lg leading-relaxed ${
                                        index > activeContentIndex ? "opacity-0" : "opacity-100"
                                    } ${index === activeContentIndex ? "text-indigo-600 dark:text-indigo-400 font-medium" : "text-gray-700 dark:text-gray-300"}`}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{
                                        opacity: index <= activeContentIndex ? 1 : 0,
                                        y: index <= activeContentIndex ? 0 : 10
                                    }}
                                    transition={{ duration: 0.5, delay: index * 0.2 }}
                                >
                                    {paragraph}
                                </motion.p>
                            ))}
                        </div>

                        {/* Character bubble (centered version) */}
                        <motion.div
                            className="mt-8 bg-indigo-100 dark:bg-indigo-900/40 p-4 rounded-lg border-l-4 border-indigo-500"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 1, duration: 0.5 }}
                        >
                            <div className="flex items-center">
                                <div className="relative w-10 h-10 mr-3">
                                    <Image
                                        src={`/images/storytelling/matter-of-state/character-${characterType}.gif`}
                                        alt={characterType === "boy" ? "রাজু" : "মিতা"}
                                        fill
                                        className="rounded-full object-cover"
                                    />
                                </div>
                                <p className="text-sm text-indigo-700 dark:text-indigo-300">
                                    {characterType === "boy"
                                        ? "রাজু: এই বিষয়টা আমি বন্ধুদের বলব!"
                                        : "মিতা: এই বিষয়টা জানতে পেরে আমি খুবই খুশি!"}
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            )}
        </div>
    );
}