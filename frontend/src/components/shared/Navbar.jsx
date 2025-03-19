import React from "react";
import { Popover } from "../ui/popover";
import { PopoverContent, PopoverTrigger } from "@radix-ui/react-popover";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { Button } from "../ui/button";
import { LogOut, User2 } from "lucide-react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const user = false;
  return (
    <div className="bg-white">
      <div className="flex items-center justify-between max-w-7xl mx-auto p-5 w-full">
        {/* Logo aligned to the left */}
        <div className="flex w-full">
          <h1 className="text-2xl font-bold ml-5">
            Job <span className="text-[#F83002]">Portal</span>
          </h1>
        </div>

        {/* Navigation and Profile */}
        <div className="flex items-center gap-12">
          <ul className="flex font-medium items-center gap-5">
            <li>Home</li>
            <li>Jobs</li>
            <li>Browse</li>
          </ul>
          {!user ? (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="outline">Login </Button>
              </Link>
              <Link to = "/signup"> <Button className="bg-[#6A38C2] hover:bg-[#1e024e]"> Signup</Button></Link>
              
            </div>
          ) : (
            <Popover>
              <PopoverTrigger asChild>
                <Avatar className="w-10 h-10">
                  <AvatarImage
                    src="https://github.com/shadcn.png"
                    alt="@shadcn"
                    className="w-full h-full rounded-full cursor-pointer"
                  />
                </Avatar>
              </PopoverTrigger>

              {/* Updated PopoverContent */}
              <PopoverContent className="w-64 p-4 flex flex-col items-start gap-2 shadow-lg bg-white rounded-lg">
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage
                      src="https://github.com/shadcn.png"
                      alt="@shadcn"
                      className="w-full h-full rounded-full"
                    />
                  </Avatar>
                  <div>
                    <h4 className="font-medium">Navin MernStack</h4>
                    <p className="text-sm text-muted-foreground">
                      Lorem ipsum dolor sit.
                    </p>
                  </div>
                </div>
                <div className="flex flex-col my-2 text-gray-400">
                  <div className="flex w-fit items-center gap-2 cursor-pointer">
                    <User2 />
                    <Button variant="link">View Profile</Button>
                  </div>
                  <div className="flex w-fit items-center gap-2 cursor-pointer">
                    <LogOut />
                    <Button variant="link"> Logout</Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
