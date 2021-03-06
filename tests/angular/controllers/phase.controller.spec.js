describe('Controller: Match', () => {

    let $controller;
    let $scope;
    let $rootScope;
    let PhaseController;

    beforeEach(module('tournamentApp'));

    beforeEach(inject(function($rootScope, $controller) {
        $rootScope = $rootScope;
        $controller = $controller;
        $scope = $rootScope.$new();
    }));

    beforeEach(inject(function($controller) {
        PhaseController = $controller('PhaseCtrl', {$scope: $scope});
    }));

    describe('Controller should be initialized properly', () => {
        it('and new phase name should be an empty string', () => {
            expect(PhaseController.newPhase.length).toEqual(0);
        })  

    })

    describe('Check edit phase name logic', () => {

        let phase;

        beforeEach(() => {
            phase = {};
        })

         it(' and it should return true when new phase name and old phase name are different', () => {
            phase.name = 'Old Phase';
            phase.newName = 'New Phase';
            expect(PhaseController.phaseNameWasChanged(phase)).toBe(true);
        })

         it(' and it should return true when new phase name and old phase name are same but new name is lower case', () => {
            phase.name = 'Old Phase';
            phase.newName = 'old phase';
            expect(PhaseController.phaseNameWasChanged(phase)).toBe(true);
            phase.newName = 'old Phase';
            expect(PhaseController.phaseNameWasChanged(phase)).toBe(true);
        })

        it(' and it should return false when new phase name and old phase name are the same', () => {
            phase.name = 'Old Phase';
            phase.newName = 'Old Phase';
            expect(PhaseController.phaseNameWasChanged(phase)).toBe(false);
        })

        it(' and it should return false when new phase name and old phase name are the same but new name has trailing white space', () => {
            phase.name = 'Old Phase';
            phase.newName = 'Old Phase    ';

            expect(PhaseController.phaseNameWasChanged(phase)).toBe(false);

            phase.newName = '  Old Phase';
            expect(PhaseController.phaseNameWasChanged(phase)).toBe(false);
        })

        it(' and it should return false if new phase name length is 0 and true otherwise assuming old and new are not the same', () => {
            phase.name = 'Old Phase';
            phase.newName = '';
            expect(PhaseController.phaseNameWasChanged(phase)).toBe(false);
            phase.newName = 'New Phase';
            expect(PhaseController.phaseNameWasChanged(phase)).toBe(true);
        })

        it(' and calling editPhase when phase name was not changed should set phase.editing to false', () => {
            phase.name = 'Old Phase';
            phase.newName = '';
            PhaseController.editPhase(phase);
            
            expect(phase.editing).toBe(false);
        })

    })

    describe('Check adding new phase logic', () => {

        let phase;
        let phases;

        beforeEach(() => {
            phase = {};
            PhaseController.phases = [
                {name: 'Prelim'},
                {name: 'Playoff'}
            ]
        });

        it('should return true if phase name length is greater than 0 and is not the same as another phase name', () => {
            phase.name = 'Next Phase';
            expect(PhaseController.isValidNewPhaseName(phase.name)).toBe(true);
        })

        it('should return false if phase name length is 0', () => {
            phase.name = '';
            expect(PhaseController.isValidNewPhaseName(phase.name)).toBe(false);
        })

        it('should return false if phase name is already in the existing phases', () => {
            phase.name = 'Prelim';
            expect(PhaseController.isValidNewPhaseName(phase.name)).toBe(false);
            phase.name = 'prelim';
            expect(PhaseController.isValidNewPhaseName(phase.name)).toBe(false);
        })

    })

})