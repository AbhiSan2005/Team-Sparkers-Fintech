import React from 'react'
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "../components/ui/navigation-menu";

const ServicesNavbar = () => {
    return (
        <div className="border-b p-3">
            <NavigationMenu position="popper" className="container mx-auto px-6" >
                <NavigationMenuList>
                    {/* Personal */}
                    <NavigationMenuItem>
                        <NavigationMenuTrigger>Personal</NavigationMenuTrigger>
                        <NavigationMenuContent>
                            <div className="p-4 grid gap-3 w-[250px]">
                                <NavigationMenuLink className="hover:underline">Savings Accounts</NavigationMenuLink>
                                <NavigationMenuLink className="hover:underline">Current Accounts</NavigationMenuLink>
                                <NavigationMenuLink className="hover:underline">Loans</NavigationMenuLink>
                                <NavigationMenuLink className="hover:underline">Cards</NavigationMenuLink>
                            </div>
                        </NavigationMenuContent>
                    </NavigationMenuItem>

                    {/* Corporate */}
                    <NavigationMenuItem>
                        <NavigationMenuTrigger>Corporate</NavigationMenuTrigger>
                        <NavigationMenuContent>
                            <div className="p-4 grid gap-3 w-[250px]">
                                <NavigationMenuLink>Cash Management</NavigationMenuLink>
                                <NavigationMenuLink>Corporate Loans</NavigationMenuLink>
                                <NavigationMenuLink>Trade Finance</NavigationMenuLink>
                            </div>
                        </NavigationMenuContent>
                    </NavigationMenuItem>

                    {/* MSME */}
                    <NavigationMenuItem>
                        <NavigationMenuTrigger>MSME</NavigationMenuTrigger>
                        <NavigationMenuContent>
                            <div className="p-4 grid gap-3 w-[250px]">
                                <NavigationMenuLink>MSME Loans</NavigationMenuLink>
                                <NavigationMenuLink>Priority Sector Lending</NavigationMenuLink>
                            </div>
                        </NavigationMenuContent>
                    </NavigationMenuItem>

                    {/* Agriculture */}
                    <NavigationMenuItem>
                        <NavigationMenuTrigger>Agriculture</NavigationMenuTrigger>
                        <NavigationMenuContent>
                            <div className="p-4 grid gap-3 w-[250px]">
                                <NavigationMenuLink>Kisan Credit Card</NavigationMenuLink>
                                <NavigationMenuLink>Agri Loans</NavigationMenuLink>
                            </div>
                        </NavigationMenuContent>
                    </NavigationMenuItem>

                    {/* NRI Services */}
                    <NavigationMenuItem>
                        <NavigationMenuTrigger>NRI Services</NavigationMenuTrigger>
                        <NavigationMenuContent>
                            <div className="p-4 grid gap-3 w-[250px]">
                                <NavigationMenuLink>NRE/NRO Accounts</NavigationMenuLink>
                                <NavigationMenuLink>Remittance</NavigationMenuLink>
                            </div>
                        </NavigationMenuContent>
                    </NavigationMenuItem>

                    {/* Treasury */}
                    <NavigationMenuItem>
                        <NavigationMenuTrigger>Treasury</NavigationMenuTrigger>
                        <NavigationMenuContent>
                            <div className="p-4 grid gap-3 w-[250px]">
                                <NavigationMenuLink>Forex</NavigationMenuLink>
                                <NavigationMenuLink>Investments</NavigationMenuLink>
                            </div>
                        </NavigationMenuContent>
                    </NavigationMenuItem>
                </NavigationMenuList>
            </NavigationMenu>
        </div>
    )
}

export default ServicesNavbar
