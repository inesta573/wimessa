package com.example.Store;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class HomeController {
    @RequestMapping("/")
    public String index(){
        return "index.html";
    }
    
    @RequestMapping("/about")
    public String about(){
        return "about.html";
    }
    
    @RequestMapping("/events")
    public String events(){
        return "events.html";
    }
    
    @RequestMapping("/resources")
    public String resources(){
        return "resources.html";
    }
    
    @RequestMapping("/maktoub")
    public String maktoub(){
        return "maktoub.html";
    }
}
