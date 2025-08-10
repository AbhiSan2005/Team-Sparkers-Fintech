import React, { useEffect } from 'react';
import { useTranslation, T } from '../context/TranslationContext.jsx';
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "../components/ui/navigation-menu";

const ServicesNavbar = () => {
    const { currentLanguage, preloadTranslations } = useTranslation();

    // Preload services navbar translations when language changes
    useEffect(() => {
        if (currentLanguage !== 'en') {
            const servicesTexts = [
                // Main menu items
                "Personal",
                "Corporate", 
                "MSME",
                "Agriculture",
                "NRI Services",
                "Treasury",
                
                // Personal submenu
                "Savings Accounts",
                "Current Accounts",
                "Loans",
                "Cards",
                
                // Corporate submenu
                "Cash Management",
                "Corporate Loans", 
                "Trade Finance",
                
                // MSME submenu
                "MSME Loans",
                "Priority Sector Lending",
                
                // Agriculture submenu
                "Kisan Credit Card",
                "Agri Loans",
                
                // NRI Services submenu
                "NRE/NRO Accounts",
                "Remittance",
                
                // Treasury submenu
                "Forex",
                "Investments"
            ];
            
            preloadTranslations(servicesTexts);
        }
    }, [currentLanguage, preloadTranslations]);

    return (
        <div className="border-b p-3">
            <NavigationMenu position="popper" className="container mx-auto px-6">
                <NavigationMenuList>
                    {/* Personal */}
                    <NavigationMenuItem>
                        <NavigationMenuTrigger>
                            <T>Personal</T>
                        </NavigationMenuTrigger>
                        <NavigationMenuContent>
                            <div className="p-4 grid gap-3 w-[250px]">
                                <NavigationMenuLink className="hover:underline">
                                    <T>Savings Accounts</T>
                                </NavigationMenuLink>
                                <NavigationMenuLink className="hover:underline">
                                    <T>Current Accounts</T>
                                </NavigationMenuLink>
                                <NavigationMenuLink className="hover:underline">
                                    <T>Loans</T>
                                </NavigationMenuLink>
                                <NavigationMenuLink className="hover:underline">
                                    <T>Cards</T>
                                </NavigationMenuLink>
                            </div>
                        </NavigationMenuContent>
                    </NavigationMenuItem>

                    {/* Corporate */}
                    <NavigationMenuItem>
                        <NavigationMenuTrigger>
                            <T>Corporate</T>
                        </NavigationMenuTrigger>
                        <NavigationMenuContent>
                            <div className="p-4 grid gap-3 w-[250px]">
                                <NavigationMenuLink>
                                    <T>Cash Management</T>
                                </NavigationMenuLink>
                                <NavigationMenuLink>
                                    <T>Corporate Loans</T>
                                </NavigationMenuLink>
                                <NavigationMenuLink>
                                    <T>Trade Finance</T>
                                </NavigationMenuLink>
                            </div>
                        </NavigationMenuContent>
                    </NavigationMenuItem>

                    {/* MSME */}
                    <NavigationMenuItem>
                        <NavigationMenuTrigger>
                            <T>MSME</T>
                        </NavigationMenuTrigger>
                        <NavigationMenuContent>
                            <div className="p-4 grid gap-3 w-[250px]">
                                <NavigationMenuLink>
                                    <T>MSME Loans</T>
                                </NavigationMenuLink>
                                <NavigationMenuLink>
                                    <T>Priority Sector Lending</T>
                                </NavigationMenuLink>
                            </div>
                        </NavigationMenuContent>
                    </NavigationMenuItem>

                    {/* Agriculture */}
                    <NavigationMenuItem>
                        <NavigationMenuTrigger>
                            <T>Agriculture</T>
                        </NavigationMenuTrigger>
                        <NavigationMenuContent>
                            <div className="p-4 grid gap-3 w-[250px]">
                                <NavigationMenuLink>
                                    <T>Kisan Credit Card</T>
                                </NavigationMenuLink>
                                <NavigationMenuLink>
                                    <T>Agri Loans</T>
                                </NavigationMenuLink>
                            </div>
                        </NavigationMenuContent>
                    </NavigationMenuItem>

                    {/* NRI Services */}
                    <NavigationMenuItem>
                        <NavigationMenuTrigger>
                            <T>NRI Services</T>
                        </NavigationMenuTrigger>
                        <NavigationMenuContent>
                            <div className="p-4 grid gap-3 w-[250px]">
                                <NavigationMenuLink>
                                    <T>NRE/NRO Accounts</T>
                                </NavigationMenuLink>
                                <NavigationMenuLink>
                                    <T>Remittance</T>
                                </NavigationMenuLink>
                            </div>
                        </NavigationMenuContent>
                    </NavigationMenuItem>

                    {/* Treasury */}
                    <NavigationMenuItem>
                        <NavigationMenuTrigger>
                            <T>Treasury</T>
                        </NavigationMenuTrigger>
                        <NavigationMenuContent>
                            <div className="p-4 grid gap-3 w-[250px]">
                                <NavigationMenuLink>
                                    <T>Forex</T>
                                </NavigationMenuLink>
                                <NavigationMenuLink>
                                    <T>Investments</T>
                                </NavigationMenuLink>
                            </div>
                        </NavigationMenuContent>
                    </NavigationMenuItem>
                </NavigationMenuList>
            </NavigationMenu>
        </div>
    );
};

export default ServicesNavbar;
