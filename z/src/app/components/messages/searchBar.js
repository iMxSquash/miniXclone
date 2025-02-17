"use client";

import { useState, useRef } from "react";
import { useUser } from "../../context/UserContext";
import useSocket from "../hook/useSocket";
import { ImageIcon, X, Search } from "lucide-react";
import Image from "next/image";

export default function SearchBar({ value, onChange }) {
    return (
        <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-light" size={20} />
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Rechercher une conversation..."
                className="w-full pl-10 pr-4 py-2 bg-background border border-border-dark rounded-full"
            />
        </div>
    );
}
