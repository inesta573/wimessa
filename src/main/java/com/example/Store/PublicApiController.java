package com.example.Store;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/public")
public class PublicApiController {

    @Autowired
    private MaktoubRepository maktoubRepository;

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private ResourceRepository resourceRepository;

    @Autowired
    private AirtableService airtableService;

    @Autowired
    private TeamMemberRepository teamMemberRepository;

    @GetMapping("/maktoub")
    public List<Maktoub> getAllMaktoub() {
        return maktoubRepository.findAll();
    }

    @GetMapping("/events")
    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    @GetMapping("/resources")
    public List<Resource> getAllResources() {
        return airtableService.getResources();
    }

    @GetMapping("/team")
    public List<TeamMember> getAllTeamMembers() {
        return teamMemberRepository.findAllByOrderByDisplayOrderAsc();
    }
}
