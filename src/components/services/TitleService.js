(function() {
  'use strict';
  angular.module('civic.services')
    .service('TitleService', TitleService);

  // @ngInject
  // Titles are constructed by parsing the state's data.titleExp string within a scope constructed
  // of the relevant CIViC entities (gene, variant, evidenceItem, variantGroup)
  function TitleService($rootScope, Genes, Variants, Evidence, VariantGroups, _, $q, $parse) {
    $rootScope.$on('$stateChangeSuccess',function(event, toState, toParams) {
      var title = '';

      var promises = {};

      var titleScope = {
        gene: {},
        variant: {},
        evidence: {},
        variantGroup: {}
      };

      // TODO: get needed entity resources by querying $state.$current.globals
      // note: requires that all resources necessary for parsing a state's titleExp must be resolved by ui-router state config

      // construct promises for relevant entities
      if(_.has(toParams, 'geneId') && titleScope.gene.entrez_id !== toParams.geneId) {
        promises.gene = Genes.get(toParams.geneId);
      }

      if(_.has(toParams, 'variantId') && titleScope.variant.id !== toParams.variantId) {
        promises.variant = Variants.get(toParams.variantId);
      }

      if(_.has(toParams, 'variantGroupId') && titleScope.variantGroup.id !== toParams.variantGroupId) {
        promises.variantGroup= VariantGroups.get(toParams.variantGroupId);
      }

      if(_.has(toParams, 'evidenceId') && titleScope.evidence.id !== toParams.evidenceId) {
        promises.evidence = Evidence.get(toParams.evidenceId);
      }

      // resolve promises, apply $parse with constructed title scope
      $q.all(promises).then(function(resolutions) {
        titleScope.gene = resolutions.gene;
        titleScope.variant = resolutions.variant;
        titleScope.evidence = resolutions.evidence;
        titleScope.variantGroup = resolutions.variantGroup;
        title = $parse(toState.data.titleExp)(titleScope);
        $rootScope.$broadcast('title:update', { newTitle: title });
      });
    });
  }

})();
