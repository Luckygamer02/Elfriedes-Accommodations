package com.jgmt.backend;

import org.junit.jupiter.api.Test;
import org.springframework.modulith.core.ApplicationModules;
import org.springframework.modulith.test.ApplicationModuleTest;

@ApplicationModuleTest
public class ModuleStructureTests {

    @Test
    void verifyModuleStructure(ApplicationModules modules) {
        modules.verify();
    }
}
